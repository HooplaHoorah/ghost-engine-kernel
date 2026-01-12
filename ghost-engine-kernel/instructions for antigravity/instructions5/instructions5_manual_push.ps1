\
# instructions5_manual_push.ps1
# Manual push option (B) as a runnable PowerShell script.
# Run from the repo root in a PowerShell session with Docker running and AWS CLI configured.

$ErrorActionPreference = "Stop"

$AccountId = "837801696495"
$Region    = "us-east-1"

$OrchRepo  = "$AccountId.dkr.ecr.$Region.amazonaws.com/ghost-engine-orchestrator-dev"
$WorkRepo  = "$AccountId.dkr.ecr.$Region.amazonaws.com/ghost-engine-worker-dev"

Write-Host "Logging in to ECR ($Region)..." -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Building orchestrator..." -ForegroundColor Cyan
docker build -t ghost-engine-orchestrator-dev:latest ".\services\orchestrator"
docker tag ghost-engine-orchestrator-dev:latest "$OrchRepo:latest"

Write-Host "Pushing orchestrator..." -ForegroundColor Cyan
docker push "$OrchRepo:latest"

Write-Host "Building worker..." -ForegroundColor Cyan
docker build -t ghost-engine-worker-dev:latest ".\services\worker"
docker tag ghost-engine-worker-dev:latest "$WorkRepo:latest"

Write-Host "Pushing worker..." -ForegroundColor Cyan
docker push "$WorkRepo:latest"

Write-Host "Done. Now force ECS redeploy in console (or via CLI) and test /healthz." -ForegroundColor Green
