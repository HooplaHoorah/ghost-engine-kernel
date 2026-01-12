output "ecr_orchestrator_repo_url" {
  value = module.ecr.orchestrator_repo_url
}

output "ecr_worker_repo_url" {
  value = module.ecr.worker_repo_url
}

output "github_actions_role_arn" {
  value = module.iam_oidc.role_arn
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "orchestrator_service_name" {
  value = module.ecs.orchestrator_service_name
}

output "worker_service_name" {
  value = module.ecs.worker_service_name
}

output "aws_region" {
  value = var.aws_region
}

output "cloudfront_domain" {
  value = module.cloudfront.domain_name
}

