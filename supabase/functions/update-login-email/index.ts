import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Supabase service configuration is missing" }, 500);
  }

  if (!token) {
    return json({ error: "Missing authorization token" }, 401);
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email" }, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) {
    return json({ error: "Invalid user session" }, 401);
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    return json({ error: profileError.message }, 500);
  }

  if (profile?.role !== "chair") {
    return json({ error: "Only the chairman can change the login email directly" }, 403);
  }

  const { data: updatedUser, error: updateError } = await admin.auth.admin.updateUserById(userData.user.id, {
    email,
    email_confirm: true,
    user_metadata: {
      ...userData.user.user_metadata,
      email
    }
  });

  if (updateError) {
    return json({ error: updateError.message }, 400);
  }

  const { error: profileUpdateError } = await admin
    .from("profiles")
    .update({ email, updated_at: new Date().toISOString() })
    .eq("id", userData.user.id);

  if (profileUpdateError) {
    return json({ error: profileUpdateError.message }, 500);
  }

  return json({ email: updatedUser.user?.email || email });
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
