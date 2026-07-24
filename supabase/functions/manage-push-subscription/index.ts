import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration is missing" }, 500);
  if (!token) return json({ error: "Missing authorization token" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: "Invalid user session" }, 401);

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || "");
  const endpoint = String(body.subscription?.endpoint || body.endpoint || "").trim();

  if (action === "status") {
    const { count, error } = await admin
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", userData.user.id);
    if (error) return json({ error: error.message }, 500);
    return json({ active: Number(count || 0) > 0, devices: count || 0 });
  }

  if (!isValidEndpoint(endpoint)) return json({ error: "Invalid push subscription endpoint" }, 400);

  if (action === "unregister") {
    const { error } = await admin
      .from("push_subscriptions")
      .delete()
      .eq("profile_id", userData.user.id)
      .eq("endpoint", endpoint);
    if (error) return json({ error: error.message }, 500);
    return json({ unregistered: true });
  }

  if (action !== "register") return json({ error: "Unsupported action" }, 400);

  const p256dh = String(body.subscription?.keys?.p256dh || "").trim();
  const auth = String(body.subscription?.keys?.auth || "").trim();
  const userAgent = String(body.userAgent || "").trim().slice(0, 500) || null;
  if (!isValidKey(p256dh) || !isValidKey(auth)) return json({ error: "Invalid push subscription keys" }, 400);

  const { error } = await admin.from("push_subscriptions").upsert({
    profile_id: userData.user.id,
    endpoint,
    p256dh,
    auth,
    user_agent: userAgent,
    updated_at: new Date().toISOString()
  }, { onConflict: "endpoint" });
  if (error) return json({ error: error.message }, 500);

  return json({ registered: true });
});

function isValidEndpoint(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && value.length <= 2048;
  } catch {
    return false;
  }
}

function isValidKey(value: string) {
  return /^[A-Za-z0-9_-]+$/.test(value) && value.length >= 16 && value.length <= 512;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
