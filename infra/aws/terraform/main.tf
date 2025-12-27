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
  project_name = var.project_name
  env          = var.env
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  env          = var.env
}

module "alb" {
  source            = "./modules/alb"
  project_name      = var.project_name
  env               = var.env
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
  env          = var.env
}

module "s3_artifacts" {
  source       = "./modules/s3"
  project_name = var.project_name
  env          = var.env
}

module "ecs" {
  source                = "./modules/ecs"
  project_name          = var.project_name
  env                   = var.env
  aws_region            = var.aws_region
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  alb_target_group_arn  = module.alb.target_group_arn
  alb_security_group_id = module.alb.security_group_id
  ecr_orchestrator_url  = module.ecr.orchestrator_repo_url
  ecr_worker_url        = module.ecr.worker_repo_url
  
  # Inject DynamoDB info
  jobs_table_name       = module.dynamodb.table_name
  jobs_table_arn        = module.dynamodb.table_arn
  artifacts_bucket_name = module.s3_artifacts.bucket_name
  artifacts_bucket_arn  = module.s3_artifacts.bucket_arn
  internal_token_arn    = module.secrets.internal_token_arn
}

module "secrets" {
  source       = "./modules/secrets"
  project_name = var.project_name
  env          = var.env
}

module "dashboard" {
  source                    = "./modules/dashboard"
  project_name              = var.project_name
  env                       = var.env
  aws_region                = var.aws_region
  cluster_name              = module.ecs.cluster_name
  orchestrator_service_name = module.ecs.orchestrator_service_name
  worker_service_name       = module.ecs.worker_service_name
}

module "cloudfront" {
  source       = "./modules/cloudfront"
  project_name = var.project_name
  env          = var.env
  alb_dns_name = module.alb.dns_name
}
