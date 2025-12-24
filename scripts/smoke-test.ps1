$ErrorActionPreference = "Stop"

Write-Host "Starting Docker Compose..."
docker compose -f infra/local/docker-compose.yml up -d --build --wait

# --wait should handle waiting, but adding a small buffer just in case
Start-Sleep -Seconds 2

Write-Host "Checking /healthz..."
try {
    $o = Invoke-RestMethod -Uri "http://localhost:8080/healthz"
    if (!$o.ok) { throw "Orchestrator healthz returned false" }
    
    $w = Invoke-RestMethod -Uri "http://localhost:8081/healthz"
    if (!$w.ok) { throw "Worker healthz returned false" }
    
    Write-Host "Health checks passed."
}
catch {
    Write-Error "Health check failed: $_"
    docker compose -f infra/local/docker-compose.yml down
    exit 1
}

Write-Host "Triggering job..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/generate-scene" -Method Post -Body (@{prompt = "test scene" } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 1)"
    
    if (!$response.job_id) {
        throw "Failed to get job ID in response"
    }
}
catch {
    Write-Error "Job trigger failed: $_"
    docker compose -f infra/local/docker-compose.yml down
    exit 1
}

Write-Host "Smoke test passed"
docker compose -f infra/local/docker-compose.yml down
