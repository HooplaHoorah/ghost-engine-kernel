# Main entry point for Ghost Engine infrastructure

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
  env          = var.env
}

module "iam_oidc" {
  source            = "./modules/iam_oidc"
  github_repo       = var.github_repo
  ecr_resource_arns = [
    module.ecr.orchestrator_repo_arn,
    module.ecr.worker_repo_arn
  ]
}