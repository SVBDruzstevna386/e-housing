param(
  [string]$PackageName = "e-housing-install-package"
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$releaseDir = Join-Path $projectRoot "release"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$stagingDir = Join-Path ([System.IO.Path]::GetTempPath()) "$PackageName-$stamp"
$zipPath = Join-Path $releaseDir "$PackageName-$stamp.zip"

$excludedPathParts = @(
  ".git",
  ".vercel",
  "node_modules",
  "dist",
  "build",
  "release",
  ".temp"
)

$excludedFileNames = @(
  ".env",
  ".env.local",
  "gmail-oauth-url.txt",
  "gmail-oauth-success.txt"
)

function Test-IsExcludedPath {
  param([string]$FullName)

  $relative = Resolve-Path -LiteralPath $FullName -Relative
  $parts = $relative -split "[\\/]" | Where-Object { $_ -and $_ -ne "." }
  foreach ($part in $parts) {
    if ($excludedPathParts -contains $part) {
      return $true
    }
  }

  $leaf = Split-Path -Leaf $FullName
  return $excludedFileNames -contains $leaf
}

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
if (Test-Path $stagingDir) {
  Remove-Item -LiteralPath $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null

Push-Location $projectRoot
try {
  Get-ChildItem -LiteralPath $projectRoot -Recurse -Force | Where-Object {
    -not (Test-IsExcludedPath $_.FullName)
  } | ForEach-Object {
    $relativePath = Resolve-Path -LiteralPath $_.FullName -Relative
    $targetPath = Join-Path $stagingDir $relativePath

    if ($_.PSIsContainer) {
      New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
    } else {
      $targetParent = Split-Path -Parent $targetPath
      New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
      Copy-Item -LiteralPath $_.FullName -Destination $targetPath -Force
    }
  }
} finally {
  Pop-Location
}

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $stagingDir "*") -DestinationPath $zipPath -Force
Remove-Item -LiteralPath $stagingDir -Recurse -Force

Write-Host "Install package created:"
Write-Host $zipPath
