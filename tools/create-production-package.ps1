param(
  [string]$PackageName = "e-Housing-Solutions-Licence-SVBDruzstevna386",
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

$excludedPathParts = @(".git", ".vercel", "node_modules", "dist", "build", "release", ".temp")
$excludedFileNames = @(".env", ".env.local", "gmail-oauth-url.txt", "gmail-oauth-success.txt", "202606120001_initial_schema.sql")
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
  return $excludedFileNames -contains (Split-Path -Leaf $FullName)
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
  "20260712020930_platform_partner_zone.sql",
  "20260712025351_platform_support_gateway.sql",
  "20260712031010_activity_logs_baseline.sql",
  "20260712042000_platform_partner_indexes.sql",
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

$forbiddenPatterns = @(
  'sbp_[A-Za-z0-9_-]{16,}',
  'GOCSPX-[A-Za-z0-9_-]{10,}',
  're_[A-Za-z0-9_-]{16,}'
)
$violations = @()
Get-ChildItem -LiteralPath $stagingDir -Recurse -File | Where-Object { Test-IsTextFile $_.FullName } | ForEach-Object {
  $content = [IO.File]::ReadAllText($_.FullName)
  foreach ($pattern in $forbiddenPatterns) {
    if ($content -match $pattern) { $violations += "$($_.FullName): $pattern" }
  }
}
if ($violations.Count) { throw "Production package validation failed:`n$($violations -join "`n")" }

$files = Get-ChildItem -LiteralPath $stagingDir -Recurse -File | Sort-Object FullName
$checksums = foreach ($file in $files) {
  [ordered]@{
    path = (Get-RelativePath -BasePath $stagingDir -FullName $file.FullName).Replace('\','/')
    sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName).Hash.ToLowerInvariant()
    bytes = $file.Length
  }
}
Set-Utf8Text -Path (Join-Path $stagingDir "INSTALL_PACKAGE_CHECKSUMS.json") -Content ($checksums | ConvertTo-Json -Depth 4)

$manifest = [ordered]@{
  packageName = $fullPackageName
  product = "e - Housing Solutions Licence"
  installation = "SVB a NP Družstevná 386"
  packageType = "production-source-backup"
  appVersion = $AppVersion
  createdAt = (Get-Date).ToString("o")
  sourceCommit = (git -C $projectRoot rev-parse HEAD 2>$null)
  fileCount = $files.Count + 2
  migrationCount = (Get-ChildItem (Join-Path $stagingDir "supabase\migrations") -File -ErrorAction SilentlyContinue).Count
  functions = @(Get-ChildItem (Join-Path $stagingDir "supabase\functions") -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)
  checksumFile = "INSTALL_PACKAGE_CHECKSUMS.json"
  containsDatabaseData = $false
  containsSecrets = $false
}
Set-Utf8Text -Path (Join-Path $stagingDir "INSTALL_PACKAGE_MANIFEST.json") -Content ($manifest | ConvertTo-Json -Depth 5)

if (Test-Path $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
Compress-Archive -Path (Join-Path $stagingDir "*") -DestinationPath $zipPath -Force
$zipHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()
Set-Utf8Text -Path "$zipPath.sha256.txt" -Content "$zipHash  $([IO.Path]::GetFileName($zipPath))"
Remove-Item -LiteralPath $stagingDir -Recurse -Force

Write-Host "Production package created:"
Write-Host $zipPath
Write-Host "SHA-256: $zipHash"
