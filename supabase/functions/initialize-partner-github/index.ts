import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const DEFAULT_APP_VERSION = "v176";

type PartnerInstallation = {
  id: string;
  slug: string | null;
  name: string;
  building_address: string | null;
  chair_name: string | null;
  chair_email: string | null;
  github_repository_url: string | null;
  production_url: string | null;
  supabase_project_ref: string | null;
  gmail_sender_email: string | null;
  service_state: Record<string, string> | null;
  plan: string | null;
};

type GitTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
};

type TargetFile = {
  path: string;
  mode: string;
  content: string;
  encoding: "utf-8" | "base64";
};

const textExtensions = new Set([
  ".css",
  ".env",
  ".example",
  ".html",
  ".js",
  ".json",
  ".md",
  ".ps1",
  ".sql",
  ".svg",
  ".toml",
  ".ts",
  ".txt",
  ".webmanifest",
  ".xml",
  ".yml",
  ".yaml"
]);

const textFileNames = new Set([
  ".gitignore",
  ".env.example",
  ".env.clean.example",
  "LICENSE",
  "README"
]);

const excludedPrefixes = [
  ".git/",
  ".vercel/",
  "release/",
  "node_modules/",
  "dist/",
  "build/",
  ".temp/",
  "supabase/functions/platform-support-session/",
  "supabase/functions/initialize-partner-github/"
];

const excludedFiles = new Set([
  ".env",
  ".env.local",
  "gmail-oauth-url.txt",
  "gmail-oauth-success.txt",
  "tools/create-install-package.ps1",
  "supabase/migrations/20260712020930_platform_partner_zone.sql",
  "supabase/migrations/20260712042000_platform_partner_indexes.sql"
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const githubToken = Deno.env.get("GITHUB_BOOTSTRAP_TOKEN");
  const templateRepository = Deno.env.get("GITHUB_TEMPLATE_REPOSITORY") || "SVBDruzstevna386/e-housing";
  const templateRef = Deno.env.get("GITHUB_TEMPLATE_REF") || "main";
  const sessionToken = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();

  if (!supabaseUrl || !serviceRoleKey || !sessionToken) return json({ error: "Missing Supabase server configuration or session" }, 401);
  if (!githubToken) return json({ error: "GITHUB_BOOTSTRAP_TOKEN is not configured in Supabase secrets" }, 503);

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(sessionToken);
  if (userError || !userData.user) return json({ error: "Invalid Platform Admin session" }, 401);

  const { data: membership } = await admin.from("platform_admins").select("user_id").eq("user_id", userData.user.id).eq("active", true).maybeSingle();
  if (!membership) return json({ error: "Platform Admin permission is required" }, 403);

  const body = await req.json().catch(() => ({}));
  const installationId = String(body.installationId || "").trim();
  const supabasePublishableKey = String(body.supabasePublishableKey || "").trim();
  const force = Boolean(body.force);
  if (!installationId) return json({ error: "Missing partner installation id" }, 400);

  const { data: installation, error: installationError } = await admin
    .from("partner_installations")
    .select("id, slug, name, building_address, chair_name, chair_email, github_repository_url, production_url, supabase_project_ref, gmail_sender_email, service_state, plan")
    .eq("id", installationId)
    .maybeSingle();
  if (installationError || !installation) return json({ error: "Partner installation was not found" }, 404);

  try {
    const result = await initializeRepository({
      githubToken,
      templateRepository,
      templateRef,
      installation: installation as PartnerInstallation,
      supabasePublishableKey,
      force
    });

    const nextServiceState = { ...(installation.service_state || {}), github: "completed" };
    await admin.from("partner_installations").update({
      service_state: nextServiceState,
      app_version: result.appVersion,
      github_repository_url: result.targetRepositoryUrl,
      updated_at: new Date().toISOString()
    }).eq("id", installationId);

    const { data: job } = await admin.from("partner_provisioning_jobs").select("id, steps").eq("installation_id", installationId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (job?.id) {
      const steps = Array.isArray(job.steps) ? job.steps.map((step: Record<string, unknown>) => step.key === "github" ? { ...step, status: "completed" } : step) : [];
      await admin.from("partner_provisioning_jobs").update({
        steps,
        current_step: "github_repository_initialized",
        status: "awaiting_authorization",
        updated_at: new Date().toISOString()
      }).eq("id", job.id);
    }

    await admin.from("partner_installation_events").insert({
      installation_id: installationId,
      actor_id: userData.user.id,
      event_type: "github_repository_initialized",
      summary: `Cista instalacia bola nahrata do GitHub repozitara ${result.targetRepository}`,
      metadata: {
        targetRepository: result.targetRepository,
        targetRepositoryUrl: result.targetRepositoryUrl,
        commitSha: result.commitSha,
        fileCount: result.fileCount,
        templateRepository,
        templateRef
      }
    });

    return json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await admin.from("partner_installation_events").insert({
      installation_id: installationId,
      actor_id: userData.user.id,
      event_type: "github_repository_initialization_failed",
      summary: `Nahratie cistej instalacie do GitHubu zlyhalo: ${message}`,
      metadata: { templateRepository, templateRef }
    });
    return json({ error: message }, 400);
  }
});

async function initializeRepository(options: {
  githubToken: string;
  templateRepository: string;
  templateRef: string;
  installation: PartnerInstallation;
  supabasePublishableKey: string;
  force: boolean;
}) {
  const targetRepository = parseGithubRepository(options.installation.github_repository_url || "");
  if (!targetRepository) throw new Error("Partner installation does not contain a valid GitHub repository URL.");
  const templateRepository = parseGithubRepository(options.templateRepository);
  if (!templateRepository) throw new Error("GITHUB_TEMPLATE_REPOSITORY must be in owner/repo format.");

  const targetRepo = await github(options.githubToken, `/repos/${targetRepository}`);
  if (!targetRepo?.full_name) throw new Error("Target GitHub repository was not found.");

  const branch = String(targetRepo.default_branch || "main");
  let existingRef = await githubMaybe(options.githubToken, `/repos/${targetRepository}/git/ref/heads/${encodeURIComponent(branch)}`);
  if (existingRef?.object?.sha && !options.force) {
    throw new Error(`Target GitHub repository already has a ${branch} branch. Initialization is allowed only for an empty repository.`);
  }
  if (!existingRef?.object?.sha) {
    existingRef = await createBootstrapCommit(options.githubToken, targetRepository, branch);
  }

  const templateTree = await loadTemplateTree(options.githubToken, templateRepository, options.templateRef);
  const replacements = buildReplacements(options.installation, options.supabasePublishableKey);
  const files = await buildTargetFiles(options.githubToken, templateRepository, templateTree, replacements);
  files.push(...generatedCleanInstallFiles(options.installation, options.supabasePublishableKey, targetRepository, replacements));

  const commitSha = await commitFilesToRepository(options.githubToken, targetRepository, branch, files, existingRef.object.sha);
  const targetRepositoryUrl = `https://github.com/${targetRepository}`;
  const appVersion = Deno.env.get("APP_VERSION") || DEFAULT_APP_VERSION;

  return {
    ok: true,
    targetRepository,
    targetRepositoryUrl,
    branch,
    commitSha,
    fileCount: files.length,
    appVersion
  };
}

async function loadTemplateTree(token: string, repository: string, refName: string) {
  const refPath = refName.replace(/^refs\/heads\//, "");
  const ref = await github(token, `/repos/${repository}/git/ref/heads/${encodeURIComponent(refPath)}`);
  const commit = await github(token, `/repos/${repository}/git/commits/${ref.object.sha}`);
  const tree = await github(token, `/repos/${repository}/git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated) throw new Error("Template repository tree is truncated. Reduce template size before automated initialization.");
  return (tree.tree || []).filter((item: GitTreeItem) => item.type === "blob" && !isExcludedPath(item.path)) as GitTreeItem[];
}

async function buildTargetFiles(token: string, templateRepository: string, tree: GitTreeItem[], replacements: Map<string, string>) {
  const files: TargetFile[] = [];
  for (const item of tree) {
    const blob = await github(token, `/repos/${templateRepository}/git/blobs/${item.sha}`);
    if (!blob?.content || !blob?.encoding) continue;
    const content = String(blob.content).replace(/\n/g, "");
    if (isTextPath(item.path)) {
      const text = decodeBase64ToText(content);
      files.push({ path: item.path, mode: item.mode || "100644", content: sanitizeText(text, replacements), encoding: "utf-8" });
    } else {
      files.push({ path: item.path, mode: item.mode || "100644", content, encoding: "base64" });
    }
  }
  return files;
}

async function createBootstrapCommit(token: string, repository: string, branch: string) {
  const bootstrapPath = ".github/e-housing-bootstrap.txt";
  await github(token, `/repos/${repository}/contents/${bootstrapPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: "Prepare repository for e - Housing initialization",
      content: btoa("Temporary bootstrap commit for e - Housing clean installation.\n")
    })
  });
  const ref = await github(token, `/repos/${repository}/git/ref/heads/${encodeURIComponent(branch)}`);
  if (!ref?.object?.sha) throw new Error("GitHub repository bootstrap did not create a branch reference.");
  return ref;
}

async function commitFilesToRepository(token: string, repository: string, branch: string, files: TargetFile[], parentSha: string) {
  const treeItems = [];
  for (const file of files) {
    const blob = await github(token, `/repos/${repository}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: file.encoding })
    });
    treeItems.push({ path: file.path, mode: file.mode, type: "blob", sha: blob.sha });
  }

  const tree = await github(token, `/repos/${repository}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ tree: treeItems })
  });
  const commit = await github(token, `/repos/${repository}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "Initial clean e - Housing Solutions Licence installation",
      tree: tree.sha,
      parents: [parentSha]
    })
  });

  await github(token, `/repos/${repository}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false })
  });
  return commit.sha as string;
}

function generatedCleanInstallFiles(installation: PartnerInstallation, supabasePublishableKey: string, repository: string, replacements: Map<string, string>): TargetFile[] {
  const svbName = installation.name || "YOUR_SVB_NAME";
  const buildingAddress = installation.building_address || "YOUR_BUILDING_ADDRESS";
  const supabaseProjectRef = installation.supabase_project_ref || "YOUR_SUPABASE_PROJECT_REF";
  const appUrl = (installation.production_url || "https://YOUR-VERCEL-APP.vercel.app").replace(/\/$/, "");
  const gmail = installation.gmail_sender_email || "YOUR_GMAIL_SENDER@gmail.com";
  const githubUrl = `https://github.com/${repository}`;
  const env = [
    "# Public frontend values",
    `SUPABASE_URL=https://${supabaseProjectRef}.supabase.co`,
    `SUPABASE_PUBLISHABLE_KEY=${supabasePublishableKey || "YOUR_SUPABASE_PUBLISHABLE_KEY"}`,
    "",
    "# Server-only values. Never commit real values.",
    "SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY",
    "GMAIL_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID",
    "GMAIL_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET",
    "GMAIL_REFRESH_TOKEN=YOUR_GMAIL_REFRESH_TOKEN",
    `GMAIL_FROM_EMAIL=${gmail}`,
    `GMAIL_FROM_NAME=${svbName}`,
    "",
    "# New house deployment",
    `APP_URL=${appUrl}`,
    `SVB_NAME=${svbName}`,
    `BUILDING_ADDRESS=${buildingAddress}`,
    `BUILDING_ID=${installation.id}`,
    `GITHUB_REPOSITORY_URL=${githubUrl}`,
    ""
  ].join("\n");
  const quickStart = [
    "# e - Housing Solutions Licence - cista instalacia",
    "",
    `Tato instalacia bola pripravena z Partnerskej zony pre ${svbName}.`,
    "",
    "## Dalsie kroky",
    "",
    "1. V Supabase vytvorte novy projekt a spustite databazove migracie.",
    "2. V Supabase nastavte secrets pre Gmail, service role a pripadne servisny pristup.",
    "3. Vo Verceli importujte tento GitHub repozitar a nastavte produkcnu URL.",
    "4. V Supabase Auth nastavte Site URL a redirect URL na produkcnu Vercel adresu.",
    "5. Otestujte login, upload suborov, emaily, PWA instalaciu a registraciu vlastnika.",
    "",
    "Citlive tokeny nikdy neukladajte do frontend kodu ani do GitHub repozitara.",
    ""
  ].join("\n");
  const manifest = JSON.stringify({
    product: "e - Housing Solutions Licence",
    packageType: "github-clean-install-bootstrap",
    appVersion: Deno.env.get("APP_VERSION") || DEFAULT_APP_VERSION,
    createdAt: new Date().toISOString(),
    source: "Partnerska zona",
    containsProductionData: false,
    containsSecrets: false,
    targetRepository: repository
  }, null, 2);
  return [
    { path: ".env.clean.example", mode: "100644", content: env, encoding: "utf-8" },
    { path: "CLEAN_INSTALL_QUICK_START.md", mode: "100644", content: quickStart, encoding: "utf-8" },
    { path: "INSTALL_PACKAGE_MANIFEST.json", mode: "100644", content: manifest, encoding: "utf-8" }
  ];
}

function buildReplacements(installation: PartnerInstallation, supabasePublishableKey: string) {
  const svbName = installation.name || "YOUR_SVB_NAME";
  const address = installation.building_address || "YOUR_BUILDING_ADDRESS";
  const supabaseRef = installation.supabase_project_ref || "YOUR_SUPABASE_PROJECT_REF";
  const vercelUrl = (installation.production_url || "https://YOUR-VERCEL-APP.vercel.app").replace(/\/$/, "");
  const vercelHost = safeHost(vercelUrl) || "YOUR-VERCEL-APP.vercel.app";
  const gmail = installation.gmail_sender_email || "YOUR_GMAIL_SENDER@gmail.com";
  const githubUrl = installation.github_repository_url || "YOUR_PRIVATE_GITHUB_REPOSITORY_URL";
  const githubName = parseGithubRepository(githubUrl) || "YOUR_GITHUB_ORG_OR_USER/YOUR_PRIVATE_REPOSITORY";
  const asciiName = stripDiacritics(svbName);
  const asciiAddress = stripDiacritics(address);
  return new Map<string, string>([
    ["https://ifyyflvxqkazndkwffvm.supabase.co", `https://${supabaseRef}.supabase.co`],
    ["ifyyflvxqkazndkwffvm", supabaseRef],
    ["sb_publishable_FfyzT0LPWKbDoeQYzDXMSw_bID7XfvC", supabasePublishableKey || "YOUR_SUPABASE_PUBLISHABLE_KEY"],
    ["https://svbdruzstevna386.vercel.app", vercelUrl],
    ["https://e-housing-zeta.vercel.app", vercelUrl],
    ["svbdruzstevna386.vercel.app", vercelHost],
    ["e-housing-zeta.vercel.app", vercelHost],
    ["https://github.com/SVBDruzstevna386/e-housing.git", githubUrl],
    ["https://github.com/SVBDruzstevna386/e-housing", githubUrl.replace(/\.git$/i, "")],
    ["SVBDruzstevna386/e-housing", githubName],
    ["SVBDruzstevna386@gmail.com", gmail],
    ["svbdruzstevna386@gmail.com", gmail.toLowerCase()],
    ["SVB a NP Družstevná 386", svbName],
    ["SVB a NP Družstevna 386", svbName],
    ["SVB a NP Druzstevna 386", asciiName],
    ["SVB Družstevná 386", svbName],
    ["Družstevná 386", address],
    ["Družstevna 386", address],
    ["Druzstevna 386", asciiAddress],
    ["38600000-0000-0000-0000-000000000386", installation.id],
    ["const PLATFORM_CONTROL_ENABLED = true;", "const PLATFORM_CONTROL_ENABLED = false;"],
    ["[functions.platform-support-session]\nverify_jwt = true\n\n", ""],
    ["[functions.initialize-partner-github]\nverify_jwt = true\n\n", ""]
  ]);
}

function sanitizeText(text: string, replacements: Map<string, string>) {
  let output = text.replace(/^\uFEFF/, "");
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

function isExcludedPath(path: string) {
  if (excludedFiles.has(path)) return true;
  return excludedPrefixes.some((prefix) => path.startsWith(prefix));
}

function isTextPath(path: string) {
  const fileName = path.split("/").pop() || "";
  if (textFileNames.has(fileName)) return true;
  const dot = fileName.lastIndexOf(".");
  const extension = dot >= 0 ? fileName.slice(dot).toLowerCase() : "";
  return textExtensions.has(extension);
}

function parseGithubRepository(value: string) {
  const clean = String(value || "").trim().replace(/\.git$/i, "");
  const direct = clean.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (direct) return `${direct[1]}/${direct[2]}`;
  try {
    const url = new URL(clean.startsWith("http") ? clean : `https://${clean}`);
    if (url.hostname.toLowerCase() !== "github.com") return "";
    const [owner, repo] = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (!owner || !repo) return "";
    return `${owner}/${repo}`;
  } catch {
    return "";
  }
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function decodeBase64ToText(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function github(token: string, path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `GitHub API returned ${response.status}`);
  return data;
}

async function githubMaybe(token: string, path: string) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (response.status === 404 || response.status === 409) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || `GitHub API returned ${response.status}`);
  return data;
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
