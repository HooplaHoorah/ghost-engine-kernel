# instructions30 — Fix Deployed 500s (ECS env vars) + Verify End-to-End

**Issue:** Deployed `/generate-scene` returns 500 because ECS tasks are missing:
- `JOBS_TABLE_NAME`
- `ARTIFACTS_BUCKET`

Evidence: `/healthz` shows `DDB=false`, `S3=null`.

**Goal:** apply the Terraform/Task Definition fix, roll ECS services, verify health + generation + browser play on the **public ALB**.

ALB Base URL (current): http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com

## What you will deliver back
1) A short report using `06-report-template.md`
2) Outputs of the key AWS CLI commands (or screenshots if using AWS Console)
3) Proof that `/generate-scene` works (jobId + status succeeded)
