output "orchestrator_repo_url" { value = aws_ecr_repository.orchestrator.repository_url }
output "worker_repo_url" { value = aws_ecr_repository.worker.repository_url }
output "orchestrator_repo_arn" { value = aws_ecr_repository.orchestrator.arn }
output "worker_repo_arn" { value = aws_ecr_repository.worker.arn }
