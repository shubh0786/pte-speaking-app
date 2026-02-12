# PTE Speaking Practice - Local HTTP Server
# Run this script to start the app: right-click > Run with PowerShell
# Then open http://localhost:8080 in your browser (Chrome recommended)

$root = $PSScriptRoot
$listener = $null
$port = 0

foreach ($tryPort in @(8080, 8081, 8082, 8083, 3000, 5000, 9090, 4000, 4200, 7000, 7070, 8888, 8000)) {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:${tryPort}/")
        $listener.Start()
        $port = $tryPort
        break
    } catch {
        Write-Host "  Port $tryPort is busy, trying next..." -ForegroundColor Yellow
        $listener = $null
    }
}

if (-not $listener) {
    Write-Host "  ERROR: Could not find a free port. Close other servers and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  =====================================" -ForegroundColor Cyan
Write-Host "   PTE Speaking Practice App" -ForegroundColor White
Write-Host "  =====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Server running at: " -NoNewline
Write-Host "http://localhost:$port" -ForegroundColor Green
Write-Host ""
Write-Host "   Open the URL above in Chrome" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "  =====================================" -ForegroundColor Cyan
Write-Host ""

# Open in default browser
Start-Process "http://localhost:$port"

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webm" = "audio/webm"
    ".mp3"  = "audio/mpeg"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $filePath = Join-Path $root ($urlPath -replace "/", "\")

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            
            $response.ContentType = "$contentType; charset=utf-8"
            $response.StatusCode = 200
            
            # CORS and security headers for Speech API
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Permissions-Policy", "microphone=(*)")
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            
            Write-Host "  200 " -NoNewline -ForegroundColor Green
            Write-Host $urlPath
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            
            Write-Host "  404 " -NoNewline -ForegroundColor Red
            Write-Host $urlPath
        }

        $response.OutputStream.Close()
    } catch {
        if ($listener.IsListening) {
            Write-Host "  Error: $_" -ForegroundColor Red
        }
    }
}
