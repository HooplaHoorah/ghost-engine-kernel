output "ecr_orchestrator" {
  value = module.ecr.orchestrator_repo_url
}

output "ecr_worker" {
  value = module.ecr.worker_repo_url
}

output "github_actions_role_arn" {
  value = module.iam_oidc.role_arn
}