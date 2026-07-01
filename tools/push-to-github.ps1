param(
  [string]$RemoteUrl = "https://github.com/SVBDruzstevna386/e-housing.git",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $projectRoot
try {
  if (-not (Test-Path ".git")) {
    git init
  }

  $remote = git remote get-url origin 2>$null
  if ($LASTEXITCODE -ne 0) {
    git remote add origin $RemoteUrl
  } elseif ($remote -ne $RemoteUrl) {
    git remote set-url origin $RemoteUrl
  }

  git branch -M $Branch
  git push -u origin $Branch
} finally {
  Pop-Location
}
