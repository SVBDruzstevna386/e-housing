import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration is missing" }, 500);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const authUser = await findAuthUser(admin, email);
  if (!authUser) return json({ cleaned: false, reason: "auth_user_not_found" });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role, email")
    .or(`id.eq.${authUser.id},email.eq.${email}`)
    .maybeSingle();

  if (profileError) return json({ error: profileError.message }, 500);

  const { data: ownerRecord, error: ownerError } = await admin
    .from("owner_records")
    .select("id, profile_id, login_email")
    .or(`profile_id.eq.${authUser.id},login_email.eq.${email}`)
    .maybeSingle();

  if (ownerError) return json({ error: ownerError.message }, 500);
  if (ownerRecord) return json({ cleaned: false, reason: "owner_record_exists" }, 409);
  if (profile) return json({ cleaned: false, reason: "profile_exists" }, 409);

  await admin.from("profiles").delete().eq("id", authUser.id);
  const { error: deleteError } = await admin.auth.admin.deleteUser(authUser.id, false);
  if (deleteError) return json({ error: deleteError.message }, 500);

  return json({ cleaned: true });
});

async function findAuthUser(admin: ReturnType<typeof createClient>, email: string) {
  let page = 1;
  const perPage = 1000;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
