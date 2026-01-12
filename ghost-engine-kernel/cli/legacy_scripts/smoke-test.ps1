param(
    [string]$BaseUrl = "http://localhost:8080",
    [switch]$NoDocker = $false
)

$ErrorActionPreference = "Stop"

if (-not $NoDocker) {
    Write-Host "Starting Docker Compose..."
    docker compose -f infra/local/docker-compose.yml up -d --build --wait
    Start-Sleep -Seconds 2
}

function Test-Health {
    param($Url)
    Write-Host "Checking $Url/healthz..."
    try {
        $res = Invoke-RestMethod -Uri "$Url/healthz"
        if (!$res.ok) { throw "Health check returned not ok" }
        Write-Host "Health check passed."
    }
    catch {
        throw "Health check failed for $Url : $_"
    }
}

try {
    # 1. Check Health
    Test-Health -Url $BaseUrl

    # 2. Trigger Job
    Write-Host "Triggering job at $BaseUrl/generate-scene..."
    $body = @{ prompt = "test scene"; style = "cyberpunk" } | ConvertTo-Json
    $jobRes = Invoke-RestMethod -Uri "$BaseUrl/generate-scene" -Method Post -Body $body -ContentType "application/json"
    
    $jobId = $jobRes.jobId
    if (-not $jobId) { 
        # Fallback for old API if needed (job_id), but we just updated it to jobId
        $jobId = $jobRes.job_id 
    }
    
    if (-not $jobId) { throw "Failed to get jobId from response: $($jobRes | ConvertTo-Json)" }
    Write-Host "Job triggered: $jobId"

    # 3. Poll Status
    $maxRetries = 20
    $state = "queued"
    
    for ($i = 0; $i -lt $maxRetries; $i++) {
        Start-Sleep -Seconds 1
        $statusRes = Invoke-RestMethod -Uri "$BaseUrl/status/$jobId"
        $state = $statusRes.state
        Write-Host "[$i] Job State: $state"

        if ($state -eq "done") {
            Write-Host "Job completed successfully!"
            Write-Host "Result: $($statusRes.result | ConvertTo-Json -Depth 2)"
            break
        }
        if ($state -eq "failed") {
            throw "Job failed: $($statusRes.error)"
        }
    }

    if ($state -ne "done") {
        throw "Job timed out or did not complete (State: $state)"
    }

}
catch {
    Write-Error "Test failed: $_"
    if (-not $NoDocker) {
        docker compose -f infra/local/docker-compose.yml down
    }
    exit 1
}

if (-not $NoDocker) {
    Write-Host "Cleaning up..."
    docker compose -f infra/local/docker-compose.yml down
}

Write-Host "Smoke test PASSED against $BaseUrl"
