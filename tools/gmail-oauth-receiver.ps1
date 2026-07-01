param(
  [Parameter(Mandatory = $true)][string]$ClientId,
  [Parameter(Mandatory = $true)][string]$ClientSecret,
  [Parameter(Mandatory = $true)][string]$SupabaseAccessToken,
  [string]$ProjectRef = "ifyyflvxqkazndkwffvm",
  [int]$Port = 53682
)

$ErrorActionPreference = "Stop"
$redirectUri = "http://localhost:$Port/oauth2callback"
$scope = "https://www.googleapis.com/auth/gmail.send"
$params = [ordered]@{
  client_id = $ClientId
  redirect_uri = $redirectUri
  response_type = "code"
  scope = $scope
  access_type = "offline"
  prompt = "consent"
}
$query = ($params.GetEnumerator() | ForEach-Object {
  [uri]::EscapeDataString($_.Key) + "=" + [uri]::EscapeDataString([string]$_.Value)
}) -join "&"
$authUrl = "https://accounts.google.com/o/oauth2/v2/auth?$query"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Set-Content -LiteralPath "$PSScriptRoot\gmail-oauth-url.txt" -Value $authUrl -Encoding UTF8
Start-Process $authUrl

$context = $listener.GetContext()
$request = $context.Request
$code = $request.QueryString["code"]
$errorParam = $request.QueryString["error"]
$html = "<html><body style='font-family:Arial,sans-serif'><h2>Google autorizacia dokoncena</h2><p>Toto okno mozes zavriet a vratit sa do Codexu.</p></body></html>"
if ($errorParam) {
  $html = "<html><body><h2>Autorizacia zlyhala</h2><p>$([System.Net.WebUtility]::HtmlEncode($errorParam))</p></body></html>"
}
$bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
$context.Response.ContentType = "text/html; charset=utf-8"
$context.Response.ContentLength64 = $bytes.Length
$context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
$context.Response.OutputStream.Close()
$listener.Stop()

if ($errorParam) { throw "Google OAuth error: $errorParam" }
if (-not $code) { throw "Google OAuth did not return a code." }

$tokenBody = @{
  code = $code
  client_id = $ClientId
  client_secret = $ClientSecret
  redirect_uri = $redirectUri
  grant_type = "authorization_code"
}
$tokenResponse = Invoke-RestMethod -Method POST -Uri "https://oauth2.googleapis.com/token" -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
if (-not $tokenResponse.refresh_token) {
  throw "Google token response did not include refresh_token."
}

$env:SUPABASE_ACCESS_TOKEN = $SupabaseAccessToken
npx supabase secrets set `
  GMAIL_CLIENT_ID="$ClientId" `
  GMAIL_CLIENT_SECRET="$ClientSecret" `
  GMAIL_REFRESH_TOKEN="$($tokenResponse.refresh_token)" `
  --project-ref $ProjectRef

Set-Content -LiteralPath "$PSScriptRoot\gmail-oauth-success.txt" -Value "Gmail OAuth token captured and Supabase secrets updated." -Encoding UTF8
