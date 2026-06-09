# Start campus services
Write-Host "========================================"
Write-Host "Campus Smart Q&A Platform"
Write-Host "========================================`n"

$services = @(
    @{Name="UserService"; Path="services\user-service"; Port=3001},
    @{Name="KnowledgeService"; Path="services\knowledge-service"; Port=3002},
    @{Name="AIService"; Path="services\ai-service"; Port=3004},
    @{Name="QAService"; Path="services\qa-service"; Port=3003},
    @{Name="MessageService"; Path="services\message-service"; Port=3005},
    @{Name="Gateway"; Path="gateway"; Port=3000}
)

$startDir = $PSScriptRoot

foreach ($svc in $services) {
    Write-Host "[$($svc.Name)] Starting on port $($svc.Port)..."
    
    $portInUse = Get-NetTCPConnection -LocalPort $svc.Port -ErrorAction SilentlyContinue
    
    if ($portInUse) {
        Write-Host "  Port $($svc.Port) is in use, skipping..."
        continue
    }
    
    $job = Start-Job -ScriptBlock {
        param($path, $port, $name)
        Set-Location $path
        node app.js
    } -ArgumentList "$startDir\$($svc.Path)", $svc.Port, $svc.Name
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================"
Write-Host "All services starting..."
Write-Host "Access: http://localhost:3000"
Write-Host "========================================`n"

Start-Sleep -Seconds 5

Write-Host "`nService status:"
foreach ($svc in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($svc.Port)/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "  [$($svc.Name)] OK - Port $($svc.Port)"
    }
    catch {
        Write-Host "  [$($svc.Name)] Starting - Port $($svc.Port)"
    }
}