param(
  [string]$PackageName = "e-Housing-Solutions-Licence-clean-install",
  [string]$AppVersion = "v176"
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$releaseDir = Join-Path $projectRoot "release"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$fullPackageName = "$PackageName-$AppVersion-$stamp"
$stagingDir = Join-Path ([System.IO.Path]::GetTempPath()) $fullPackageName
$zipPath = Join-Path $releaseDir "$fullPackageName.zip"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$excludedPathParts = @(".git", ".vercel", "node_modules", "dist", "build", "release", ".temp", "platform-support-session", "initialize-partner-github")
$excludedFileNames = @(".env", ".env.local", "gmail-oauth-url.txt", "gmail-oauth-success.txt", "202606120001_initial_schema.sql", "20260712020930_platform_partner_zone.sql", "20260712042000_platform_partner_indexes.sql")
$excludedPackageTools = @("create-install-package.ps1", "create-production-package.ps1")
$textExtensions = @(".css", ".env", ".example", ".html", ".js", ".json", ".md", ".ps1", ".sql", ".svg", ".toml", ".ts", ".txt", ".webmanifest")

function Get-RelativePath {
  param([string]$BasePath, [string]$FullName)
  Push-Location $BasePath
  try {
    return (Resolve-Path -LiteralPath $FullName -Relative) -replace '^\.[\\/]', ''
  } finally {
    Pop-Location
  }
}

function Test-IsExcludedPath {
  param([string]$FullName)
  $relative = Get-RelativePath -BasePath $projectRoot -FullName $FullName
  $parts = $relative -split "[\\/]"
  foreach ($part in $parts) {
    if ($excludedPathParts -contains $part) { return $true }
  }
  $leaf = Split-Path -Leaf $FullName
  return ($excludedFileNames -contains $leaf) -or ($excludedPackageTools -contains $leaf)
}

function Test-IsTextFile {
  param([string]$Path)
  $leaf = Split-Path -Leaf $Path
  if ($leaf -in @(".gitignore", ".env.example", ".env.clean.example")) { return $true }
  return $textExtensions -contains [IO.Path]::GetExtension($Path).ToLowerInvariant()
}

function Set-Utf8Text {
  param([string]$Path, [string]$Content)
  [IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
if (Test-Path $stagingDir) { Remove-Item -LiteralPath $stagingDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null

Get-ChildItem -LiteralPath $projectRoot -Recurse -Force | Where-Object {
  -not (Test-IsExcludedPath $_.FullName)
} | ForEach-Object {
  $relativePath = Get-RelativePath -BasePath $projectRoot -FullName $_.FullName
  $targetPath = Join-Path $stagingDir $relativePath
  if ($_.PSIsContainer) {
    New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
  } else {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $targetPath) | Out-Null
    Copy-Item -LiteralPath $_.FullName -Destination $targetPath -Force
  }
}

# Supabase requires every migration version to be unique. The development
# repository contains historical files with shared date prefixes, so the clean
# package receives a deterministic order that can be pushed in one pass.
$migrationOrder = @(
  "20260612_live_app_schema.sql",
  "20260612_announcements_policy.sql",
  "20260612_documents_policy_and_links.sql",
  "20260612_message_threads_parent.sql",
  "20260612_owner_records.sql",
  "20260612_role_policy_cleanup.sql",
  "20260612_security_storage.sql",
  "20260612_vote_recount_rpc.sql",
  "20260613_billing_settlements.sql",
  "20260613_delete_actions_and_operation_mode.sql",
  "20260613_economic_role.sql",
  "20260613_execution_cases.sql",
  "20260613_finance_and_innovation.sql",
  "20260613_finance_year.sql",
  "20260613_gdpr_settings.sql",
  "20260613_public_building_photo.sql",
  "20260613_vote_questions.sql",
  "20260614_fix_registration_owner_records.sql",
  "20260618_owner_profile_correspondence_address.sql",
  "20260622051911_message_to_chair_email_template.sql",
  "20260622131212_notification_deep_link_email_template.sql",
  "20260625150117_fix_admin_role_rls_for_announcements.sql",
  "20260625150454_harden_announcements_admin_policy.sql",
  "20260701023330_announcement_document_media_links.sql",
  "20260702032005_profile_photo_path.sql",
  "20260702043500_profile_photo_storage_policies.sql",
  "20260702073500_multi_property_owner_records.sql",
  "20260702093000_profile_ui_theme.sql",
  "20260702101500_add_cartoon_3d_ui_theme.sql",
  "20260703090000_notification_log_delete_policy.sql",
  "20260707100000_owner_announcement_oznam_insert.sql",
  "20260707103000_owner_announcement_oznam_update_delete.sql",
  "20260707110000_classifieds.sql",
  "20260707111000_classified_categories_chair_only.sql",
  "20260707120000_classifieds_media.sql",
  "20260708100000_rename_product_license_text.sql",
  "20260712025351_platform_support_gateway.sql",
  "20260712031010_activity_logs_baseline.sql",
  "20260713004613_reconcile_runtime_schema.sql"
)
$stagedMigrations = Join-Path $stagingDir "supabase\migrations"
$availableMigrations = @(Get-ChildItem -LiteralPath $stagedMigrations -File -Filter "*.sql")
if ($availableMigrations.Count -ne $migrationOrder.Count) {
  throw "Unexpected migration count. Expected $($migrationOrder.Count), found $($availableMigrations.Count)."
}
for ($index = 0; $index -lt $migrationOrder.Count; $index++) {
  $source = Join-Path $stagedMigrations $migrationOrder[$index]
  if (-not (Test-Path -LiteralPath $source)) { throw "Required migration is missing: $($migrationOrder[$index])" }
  $suffix = $migrationOrder[$index] -replace '^\d+_', ''
  $version = 20260612001010 + ($index * 10)
  $target = Join-Path $stagedMigrations ("{0}_{1}" -f $version, $suffix)
  Move-Item -LiteralPath $source -Destination $target
}

# Production-specific values are replaced only inside the staged clean-install copy.
$sanitizers = @(
  @("https://ifyyflvxqkazndkwffvm.supabase.co", "https://YOUR_SUPABASE_PROJECT_REF.supabase.co"),
  @("ifyyflvxqkazndkwffvm", "YOUR_SUPABASE_PROJECT_REF"),
  @("sb_publishable_FfyzT0LPWKbDoeQYzDXMSw_bID7XfvC", "YOUR_SUPABASE_PUBLISHABLE_KEY"),
  @("https://svbdruzstevna386.vercel.app", "https://YOUR-VERCEL-APP.vercel.app"),
  @("https://e-housing-zeta.vercel.app", "https://YOUR-VERCEL-APP.vercel.app"),
  @("svbdruzstevna386.vercel.app", "YOUR-VERCEL-APP.vercel.app"),
  @("e-housing-zeta.vercel.app", "YOUR-VERCEL-APP.vercel.app"),
  @("https://github.com/SVBDruzstevna386/e-housing.git", "YOUR_PRIVATE_GITHUB_REPOSITORY_URL"),
  @("https://github.com/SVBDruzstevna386/e-housing", "YOUR_PRIVATE_GITHUB_REPOSITORY_URL"),
  @("SVBDruzstevna386/e-housing", "YOUR_GITHUB_ORG_OR_USER/YOUR_PRIVATE_REPOSITORY"),
  @("SVBDruzstevna386@gmail.com", "YOUR_GMAIL_SENDER@gmail.com"),
  @("svbdruzstevna386@gmail.com", "YOUR_GMAIL_SENDER@gmail.com"),
  @("SVB a NP Družstevná 386", "YOUR_SVB_NAME"),
  @("SVB a NP Družstevna 386", "YOUR_SVB_NAME"),
  @("SVB a NP Druzstevna 386", "YOUR_SVB_NAME_ASCII"),
  @("SVB Družstevná 386", "YOUR_SVB_NAME"),
  @("Družstevná 386", "YOUR_BUILDING_ADDRESS"),
  @("Družstevna 386", "YOUR_BUILDING_ADDRESS"),
  @("Druzstevna 386", "YOUR_BUILDING_ADDRESS_ASCII"),
  @("38600000-0000-0000-0000-000000000386", "YOUR_BUILDING_UUID")
)

Get-ChildItem -LiteralPath $stagingDir -Recurse -File | Where-Object { Test-IsTextFile $_.FullName } | ForEach-Object {
  $content = [IO.File]::ReadAllText($_.FullName)
  foreach ($entry in $sanitizers) { $content = $content.Replace($entry[0], $entry[1]) }
  $content = $content.Replace("const PLATFORM_CONTROL_ENABLED = true;", "const PLATFORM_CONTROL_ENABLED = false;")
  $content = $content -replace '(?ms)^\[functions\.platform-support-session\]\r?\nverify_jwt\s*=\s*true\r?\n?', ''
  $content = $content -replace '(?ms)^\[functions\.initialize-partner-github\]\r?\nverify_jwt\s*=\s*true\r?\n?', ''
  Set-Utf8Text -Path $_.FullName -Content $content
}

$cleanEnv = @'
# Public frontend values
SUPABASE_URL=https://YOUR_SUPABASE_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

# Server-only values. Never commit real values.
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
GMAIL_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
GMAIL_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
GMAIL_REFRESH_TOKEN=YOUR_GMAIL_REFRESH_TOKEN
GMAIL_FROM_EMAIL=YOUR_GMAIL_SENDER@gmail.com
GMAIL_FROM_NAME=YOUR_SVB_NAME

# New house deployment
APP_URL=https://YOUR-VERCEL-APP.vercel.app
SVB_NAME=YOUR_SVB_NAME
BUILDING_ADDRESS=YOUR_BUILDING_ADDRESS
BUILDING_ID=YOUR_BUILDING_UUID
GITHUB_REPOSITORY_URL=YOUR_PRIVATE_GITHUB_REPOSITORY_URL
'@
Set-Utf8Text -Path (Join-Path $stagingDir ".env.example") -Content $cleanEnv
Set-Utf8Text -Path (Join-Path $stagingDir ".env.clean.example") -Content $cleanEnv

$configureScript = @'
param(
  [Parameter(Mandatory=$true)][string]$SvbName,
  [Parameter(Mandatory=$true)][string]$BuildingAddress,
  [Parameter(Mandatory=$true)][string]$SupabaseUrl,
  [Parameter(Mandatory=$true)][string]$SupabasePublishableKey,
  [Parameter(Mandatory=$true)][string]$VercelUrl,
  [Parameter(Mandatory=$true)][string]$GmailFromEmail,
  [Parameter(Mandatory=$true)][string]$GithubRepositoryUrl,
  [string]$BuildingId = ([guid]::NewGuid().ToString())
)

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

if ($SupabaseUrl -notmatch '^https://[a-z0-9]+\.supabase\.co/?$') { throw "SupabaseUrl nema ocakavany format." }
if ($VercelUrl -notmatch '^https://[^/]+/?$') { throw "VercelUrl musi byt produkcna HTTPS adresa bez dalsej cesty." }
if ($GmailFromEmail -notmatch '^[^@\s]+@gmail\.com$') { throw "GmailFromEmail musi byt platna gmail.com adresa." }
if ($BuildingId -notmatch '^[0-9a-fA-F-]{36}$') { throw "BuildingId musi byt UUID." }

$SupabaseProjectRef = ($SupabaseUrl.TrimEnd('/') -replace '^https://', '') -replace '\.supabase\.co$', ''
$VercelUrl = $VercelUrl.TrimEnd('/')
$HostName = ([Uri]$VercelUrl).Host
$asciiName = $SvbName.Normalize([Text.NormalizationForm]::FormD)
$asciiName = -join ($asciiName.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })
$asciiAddress = $BuildingAddress.Normalize([Text.NormalizationForm]::FormD)
$asciiAddress = -join ($asciiAddress.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark })

$replacements = [ordered]@{
  "https://YOUR_SUPABASE_PROJECT_REF.supabase.co" = $SupabaseUrl.TrimEnd('/')
  "YOUR_SUPABASE_PROJECT_REF" = $SupabaseProjectRef
  "YOUR_SUPABASE_PUBLISHABLE_KEY" = $SupabasePublishableKey
  "https://YOUR-VERCEL-APP.vercel.app" = $VercelUrl
  "YOUR-VERCEL-APP.vercel.app" = $HostName
  "YOUR_GMAIL_SENDER@gmail.com" = $GmailFromEmail
  "YOUR_SVB_NAME_ASCII" = $asciiName
  "YOUR_SVB_NAME" = $SvbName
  "YOUR_BUILDING_ADDRESS_ASCII" = $asciiAddress
  "YOUR_BUILDING_ADDRESS" = $BuildingAddress
  "YOUR_BUILDING_UUID" = $BuildingId
  "YOUR_PRIVATE_GITHUB_REPOSITORY_URL" = $GithubRepositoryUrl.TrimEnd('/')
  "YOUR_GITHUB_ORG_OR_USER/YOUR_PRIVATE_REPOSITORY" = ($GithubRepositoryUrl.TrimEnd('/') -replace '^https://github.com/', '')
}

$extensions = @('.css','.env','.example','.html','.js','.json','.md','.ps1','.sql','.svg','.toml','.ts','.txt','.webmanifest')
Get-ChildItem -LiteralPath $Root -Recurse -File | Where-Object {
  $_.FullName -notmatch '[\\/]\.git[\\/]' -and ($extensions -contains $_.Extension.ToLowerInvariant() -or $_.Name -in @('.gitignore','.env.example','.env.clean.example'))
} | ForEach-Object {
  $content = [IO.File]::ReadAllText($_.FullName)
  foreach ($entry in $replacements.GetEnumerator()) { $content = $content.Replace($entry.Key, [string]$entry.Value) }
  [IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
}

Write-Host "Konfiguracia noveho domu bola pripravena."
Write-Host "Supabase ref: $SupabaseProjectRef"
Write-Host "Vercel host: $HostName"
Write-Host "Building ID: $BuildingId"
Write-Host "Dalsi krok: precitajte CLEAN_INSTALL_QUICK_START.md a vytvorte nove cloudove projekty pod novymi uctami."
'@
New-Item -ItemType Directory -Force -Path (Join-Path $stagingDir "tools") | Out-Null
Set-Utf8Text -Path (Join-Path $stagingDir "tools\configure-clean-instance.ps1") -Content $configureScript

$quickStart = @'
# e - Housing Solutions Licence - cista instalacia pre novy bytovy dom

Tento ZIP je prenosny zdrojovy a migracny balik. Je urceny pre novu samostatnu instalaciu s novym GitHub repozitarom, novym Vercel projektom a URL, novym Supabase projektom/databazou a novym Gmail/Google Cloud uctom.

## Dolezite pravidlo uctov

Nova instalacia sa nesmie pripojit k uctom ani databaze povodneho domu. Pouzivatel pocas instalacie vytvori alebo spristupni nove ucty a projekty. Codex moze po udeleni pristupu pomoct s ich konfiguraciou; vytvorenie uctu, 2FA, OAuth suhlas a potvrdenie pripadnych nakladov musi vykonat alebo potvrdit vlastnik noveho domu.

## Odporucane poradie

1. Vytvorte novy sukromny GitHub repozitar.
2. Vytvorte novy Supabase projekt v EU regione.
3. Vytvorte novy Gmail ucet a Google Cloud OAuth klient s Gmail API.
4. Vytvorte novy Vercel projekt a zvolte novu produkcnu URL.
5. Spustite `tools/configure-clean-instance.ps1` s hodnotami noveho domu.
6. Commitnite nakonfigurovany projekt do noveho sukromneho GitHub repozitara.
7. Prepojte Supabase CLI na novy projekt a spustite `supabase db push`.
8. Nastavte Gmail secrets iba v Supabase secrets, nikdy nie v GitHube ani vo frontend kode.
9. Nasadte vsetky Edge Functions a potom aplikaciu na Vercel.
10. V Supabase Auth nastavte novu Site URL a Redirect URLs.
11. Vytvorte prveho predsedu SVB a vykonajte testy v `docs/deployment-checklist.md`.

## Konfiguracny prikaz

```powershell
.\tools\configure-clean-instance.ps1 `
  -SvbName "SVB a NP Novy dom 12" `
  -BuildingAddress "Nova 12, Mesto" `
  -SupabaseUrl "https://NOVY_PROJECT_REF.supabase.co" `
  -SupabasePublishableKey "NOVY_PUBLISHABLE_KEY" `
  -VercelUrl "https://novy-dom.vercel.app" `
  -GmailFromEmail "svb.novy.dom@gmail.com" `
  -GithubRepositoryUrl "https://github.com/NOVY_UCET/NOVY_REPO"
```

Tajne hodnoty `SUPABASE_SERVICE_ROLE_KEY`, `GMAIL_CLIENT_SECRET` a `GMAIL_REFRESH_TOKEN` sa tomuto skriptu nezadavaju a neukladaju do projektu.
'@
Set-Utf8Text -Path (Join-Path $stagingDir "CLEAN_INSTALL_QUICK_START.md") -Content $quickStart

# Fail closed if the staged package still points at the current production instance or contains known secret formats.
$forbiddenPatterns = @(
  'ifyyflvxqkazndkwffvm', 'e-housing-zeta\.vercel\.app', 'svbdruzstevna386',
  'sbp_[A-Za-z0-9_-]{16,}', 'GOCSPX-[A-Za-z0-9_-]{10,}', 're_[A-Za-z0-9_-]{16,}'
)
$violations = @()
Get-ChildItem -LiteralPath $stagingDir -Recurse -File | Where-Object { Test-IsTextFile $_.FullName } | ForEach-Object {
  $content = [IO.File]::ReadAllText($_.FullName)
  foreach ($pattern in $forbiddenPatterns) {
    if ($content -match $pattern) { $violations += "$($_.FullName): $pattern" }
  }
}
if ($violations.Count) { throw "Clean package validation failed:`n$($violations -join "`n")" }

$files = Get-ChildItem -LiteralPath $stagingDir -Recurse -File | Sort-Object FullName
$checksums = foreach ($file in $files) {
  [ordered]@{
    path = (Get-RelativePath -BasePath $stagingDir -FullName $file.FullName).Replace('\\','/')
    sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash.ToLowerInvariant()
    bytes = $file.Length
  }
}
$checksumPath = Join-Path $stagingDir "INSTALL_PACKAGE_CHECKSUMS.json"
Set-Utf8Text -Path $checksumPath -Content ($checksums | ConvertTo-Json -Depth 4)

$manifest = [ordered]@{
  packageName = $fullPackageName
  product = "e - Housing Solutions Licence"
  packageType = "clean-install-template"
  appVersion = $AppVersion
  createdAt = (Get-Date).ToString("o")
  purpose = "Independent installation for a new house using new GitHub, Vercel, Supabase, Gmail and Google Cloud accounts."
  sourceCommit = (git -C $projectRoot rev-parse HEAD 2>$null)
  fileCount = $files.Count + 2
  migrationCount = (Get-ChildItem (Join-Path $stagingDir "supabase\migrations") -File -ErrorAction SilentlyContinue).Count
  functions = @(Get-ChildItem (Join-Path $stagingDir "supabase\functions") -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)
  firstRead = "CLEAN_INSTALL_QUICK_START.md"
  configurationTool = "tools/configure-clean-instance.ps1"
  checksumFile = "INSTALL_PACKAGE_CHECKSUMS.json"
  requiresNewAccounts = @("GitHub", "Vercel", "Supabase", "Gmail", "Google Cloud OAuth")
  containsProductionData = $false
  containsSecrets = $false
}
Set-Utf8Text -Path (Join-Path $stagingDir "INSTALL_PACKAGE_MANIFEST.json") -Content ($manifest | ConvertTo-Json -Depth 5)

if (Test-Path $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
Compress-Archive -Path (Join-Path $stagingDir "*") -DestinationPath $zipPath -Force
$zipHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()
Set-Utf8Text -Path "$zipPath.sha256.txt" -Content "$zipHash  $([IO.Path]::GetFileName($zipPath))"
Remove-Item -LiteralPath $stagingDir -Recurse -Force

Write-Host "Clean install package created:"
Write-Host $zipPath
Write-Host "SHA-256: $zipHash"
