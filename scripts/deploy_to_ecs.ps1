$ErrorActionPreference = "Stop"

# Get outputs from Terraform
Write-Host "Fetching Terraform outputs..."
cd infra/aws/terraform
$tfOutput = terraform output -json | ConvertFrom-Json
cd ../../..

$region = $tfOutput.aws_region.value
$orchRepo = $tfOutput.ecr_orchestrator_repo_url.value
$workerRepo = $tfOutput.ecr_worker_repo_url.value
$cluster = $tfOutput.ecs_cluster_name.value
$orchService = $tfOutput.orchestrator_service_name.value
$workerService = $tfOutput.worker_service_name.value

Write-Host "Region: $region"
Write-Host "Orchestrator Repo: $orchRepo"
Write-Host "Worker Repo: $workerRepo"

# Login to ECR
Write-Host "Logging into ECR..."
aws ecr get-login-password --region $region --profile dev | docker login --username AWS --password-stdin $orchRepo.Split('/')[0]

# Build and Push Orchestrator
Write-Host "Building Orchestrator..."
docker build -t "$orchRepo`:latest" services/orchestrator
Write-Host "Pushing Orchestrator..."
docker push "$orchRepo`:latest"

# Build and Push Worker
Write-Host "Building Worker..."
docker build -t "$workerRepo`:latest" services/worker
Write-Host "Pushing Worker..."
docker push "$workerRepo`:latest"

# Force Deployment to pick up new images
Write-Host "Updating ECS Services to pick up new images..."
aws ecs update-service --cluster $cluster --service $orchService --force-new-deployment --region $region --profile dev
aws ecs update-service --cluster $cluster --service $workerService --force-new-deployment --region $region --profile dev

Write-Host "Deployment complete!"
