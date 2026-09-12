param(
    [int]$Port = 3000
)

$scriptDir = $PSScriptRoot
Add-Type -Path (Join-Path $scriptDir "Server.cs")

$server = New-Object FastServer
$server.Start($Port, $scriptDir)

Write-Host "Multi-threaded high-performance server running at http://localhost:$Port/"

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $server.Stop()
}
