import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

type SupportConfig = Record<string, { sharedSecret: string }>;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rawConfig = Deno.env.get("PARTNER_SUPPORT_CONFIG") || "{}";
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  if (!supabaseUrl || !serviceRoleKey || !token) return json({ error: "Missing server configuration or session" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: "Invalid Platform Admin session" }, 401);

  const { data: membership } = await admin.from("platform_admins").select("user_id").eq("user_id", userData.user.id).eq("active", true).maybeSingle();
  if (!membership) return json({ error: "Platform Admin permission is required" }, 403);

  const body = await req.json().catch(() => ({}));
  const installationId = String(body.installationId || "");
  const accessLogId = String(body.accessLogId || "");
  const reason = String(body.reason || "").trim();
  if (!installationId || !accessLogId || !reason) return json({ error: "Missing installation, access log or reason" }, 400);

  const { data: installation, error: installationError } = await admin
    .from("partner_installations")
    .select("id, name, status, production_url, supabase_project_ref, support_access_status")
    .eq("id", installationId)
    .maybeSingle();
  if (installationError || !installation) return json({ error: "Partner installation was not found" }, 404);
  if (installation.status !== "active" || installation.support_access_status !== "ready") return json({ error: "Partner support access is not active" }, 409);
  if (!installation.supabase_project_ref || !installation.production_url) return json({ error: "Target Supabase project or production URL is missing" }, 409);

  let supportConfig: SupportConfig;
  try {
    supportConfig = JSON.parse(rawConfig);
  } catch {
    return json({ error: "PARTNER_SUPPORT_CONFIG is not valid JSON" }, 500);
  }
  const tenantConfig = supportConfig[installationId];
  if (!tenantConfig?.sharedSecret) return json({ error: "Support secret for this installation is not configured" }, 409);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const payload = {
    installationId,
    accessLogId,
    platformAdminId: userData.user.id,
    platformAdminEmail: userData.user.email || "",
    reason,
    targetUrl: installation.production_url,
    expiresAt,
    nonce: crypto.randomUUID()
  };
  const payloadText = JSON.stringify(payload);
  const signature = await hmac(payloadText, tenantConfig.sharedSecret);
  const gatewayUrl = `https://${installation.supabase_project_ref}.supabase.co/functions/v1/platform-support-login`;

  const targetResponse = await fetch(gatewayUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: payloadText, signature })
  });
  const targetData = await targetResponse.json().catch(() => ({}));
  if (!targetResponse.ok || !targetData.actionUrl) {
    await admin.from("platform_access_logs").update({ status: "failed", ended_at: new Date().toISOString(), metadata: { targetError: targetData.error || targetResponse.status } }).eq("id", accessLogId);
    return json({ error: targetData.error || `Target support gateway returned ${targetResponse.status}` }, 502);
  }

  await admin.from("platform_access_logs").update({ status: "issued", expires_at: expiresAt, metadata: { nonce: payload.nonce } }).eq("id", accessLogId);
  return json({ actionUrl: targetData.actionUrl, expiresAt });
});

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return base64Url(signature);
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
