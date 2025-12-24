# Architecture Overview (AWS-first, hybrid-ready)

Core services:
- orchestrator: routing + policy + module selection
- runtime: deterministic simulation kernel (ECS tick/state)
- worker: task execution/transforms
- inference(optional): AI generation or external model calls

AWS baseline:
- CloudFront+S3, API GW+Lambda, ECS Fargate, Cognito, RDS Postgres, CloudWatch
