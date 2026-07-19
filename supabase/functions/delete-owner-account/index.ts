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
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Supabase service configuration is missing" }, 500);
  if (!token) return json({ error: "Missing authorization token" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: "Invalid user session" }, 401);

  const { data: actor, error: actorError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (actorError) return json({ error: actorError.message }, 500);
  if (actor?.role !== "chair") return json({ error: "Only the chairman can delete user accounts" }, 403);

  const body = await req.json().catch(() => ({}));
  const ownerRecordId = String(body.ownerRecordId || "").trim();
  const profileId = String(body.profileId || "").trim();
  const email = String(body.email || "").trim().toLowerCase();

  let ownerRecord: { id: string; profile_id: string | null; login_email: string | null } | null = null;
  if (ownerRecordId) {
    const { data, error } = await admin
      .from("owner_records")
      .select("id, profile_id, login_email")
      .eq("id", ownerRecordId)
      .maybeSingle();
    if (error) return json({ error: error.message }, 500);
    ownerRecord = data;
  }

  const authUserId = ownerRecord?.profile_id || profileId || await findAuthUserId(admin, email);

  if (authUserId) {
    const { data: targetProfile, error: targetProfileError } = await admin
      .from("profiles")
      .select("id, role")
      .eq("id", authUserId)
      .maybeSingle();
    if (targetProfileError) return json({ error: targetProfileError.message }, 500);
    if (targetProfile?.role === "chair" || authUserId === actor.id) {
      return json({ error: "The chairman account cannot be deleted" }, 403);
    }
  }

  if (ownerRecord?.id) {
    const { error } = await admin.from("owner_records").delete().eq("id", ownerRecord.id);
    if (error) return json({ error: error.message }, 500);
  } else if (email) {
    const { error } = await admin.from("owner_records").delete().eq("login_email", email);
    if (error) return json({ error: error.message }, 500);
  }

  if (authUserId) {
    await admin.from("owner_records").delete().eq("profile_id", authUserId);
    await admin.from("profiles").delete().eq("id", authUserId);
    const { error } = await admin.auth.admin.deleteUser(authUserId, false);
    if (error) return json({ error: error.message }, 500);
  }

  return json({ deleted: true, authUserDeleted: Boolean(authUserId) });
});

async function findAuthUserId(admin: ReturnType<typeof createClient>, email: string) {
  if (!email) return "";
  let page = 1;
  const perPage = 1000;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match.id;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return "";
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
