import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

type SupportPayload = {
  installationId: string;
  accessLogId: string;
  platformAdminId: string;
  platformAdminEmail: string;
  reason: string;
  targetUrl: string;
  expiresAt: string;
  nonce: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const sharedSecret = Deno.env.get("PLATFORM_SUPPORT_SHARED_SECRET");
  const installationId = Deno.env.get("PLATFORM_INSTALLATION_ID");
  const supportEmail = Deno.env.get("PLATFORM_SUPPORT_EMAIL");
  if (!supabaseUrl || !serviceRoleKey || !sharedSecret || !installationId || !supportEmail) return json({ error: "Support gateway is not configured" }, 503);

  const body = await req.json().catch(() => ({}));
  const payloadText = String(body.payload || "");
  const suppliedSignature = String(body.signature || "");
  const expectedSignature = await hmac(payloadText, sharedSecret);
  if (!payloadText || !safeEqual(suppliedSignature, expectedSignature)) return json({ error: "Invalid support handoff signature" }, 401);

  let payload: SupportPayload;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    return json({ error: "Invalid support handoff payload" }, 400);
  }
  if (payload.installationId !== installationId) return json({ error: "Installation identity mismatch" }, 403);
  const expiresAt = Date.parse(payload.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || expiresAt > Date.now() + 10 * 60 * 1000) return json({ error: "Support handoff expired" }, 401);
  if (!payload.nonce || !payload.accessLogId || !payload.reason) return json({ error: "Incomplete support handoff" }, 400);

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  await admin.from("platform_support_nonces").delete().lt("expires_at", new Date().toISOString());
  const { error: nonceError } = await admin.from("platform_support_nonces").insert({ nonce: payload.nonce, access_log_id: payload.accessLogId, expires_at: payload.expiresAt });
  if (nonceError) return json({ error: "Support handoff was already used" }, 409);

  const redirectTo = `${payload.targetUrl.replace(/\/$/, "")}/?platformSupport=1`;
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: supportEmail, options: { redirectTo } });
  if (linkError || !linkData?.properties?.action_link || !linkData.user) return json({ error: linkError?.message || "Support login link could not be generated" }, 500);

  await admin.auth.admin.updateUserById(linkData.user.id, {
    app_metadata: { ...(linkData.user.app_metadata || {}), platform_support: true, platform_installation_id: installationId, platform_support_expires_at: payload.expiresAt },
    user_metadata: { ...(linkData.user.user_metadata || {}), full_name: "Platform Admin – servisný prístup", role: "chair" }
  });
  await admin.from("profiles").upsert({
    id: linkData.user.id,
    role: "chair",
    approval_status: "approved",
    full_name: "Platform Admin – servisný prístup",
    email: supportEmail,
    note: "Časovo obmedzený a auditovaný servisný účet centrálnej platformy"
  }, { onConflict: "id" });
  await admin.from("activity_logs").insert({
    actor_id: linkData.user.id,
    actor_email: payload.platformAdminEmail,
    actor_name: "Platform Admin – servisný prístup",
    actor_role: "Platform Admin",
    activity_type: "platform_support_login_issued",
    activity_label: payload.reason,
    related_table: "profiles",
    related_id: linkData.user.id,
    metadata: { accessLogId: payload.accessLogId, platformAdminId: payload.platformAdminId, expiresAt: payload.expiresAt }
  });

  return json({ actionUrl: linkData.properties.action_link, expiresAt: payload.expiresAt });
});

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return base64Url(signature);
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return diff === 0;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
