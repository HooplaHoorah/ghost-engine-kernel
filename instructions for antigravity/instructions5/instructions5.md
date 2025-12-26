# instructions5.md — Fix ECR-empty / ECS CannotPullContainerError (:latest not found)

## Situation
ECS services are configured correctly but are failing with:

- `CannotPullContainerError … ghost-engine-orchestrator-dev:latest … not found`

This happens because **ECR is empty** (no images were pushed), so ECS can’t pull the `:latest` tag.

Below are **two ways to fix**:
- **Option A (Preferred):** Fix GitHub Actions “Build and Push” to publish images to ECR.
- **Option B (Fastest):** Manually build & push images to ECR from a machine with Docker.

Do Option A first. If it stalls, do Option B to get live quickly.

---

# Option A — GitHub Actions build & push (preferred)

## A1) Confirm Terraform outputs (already known)
- Account: `837801696495`
- Region: `us-east-1`
- ECR orchestrator repo:
  `837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-orchestrator-dev`
- ECR worker repo:
  `837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-worker-dev`
- GitHub OIDC role ARN:
  `arn:aws:iam::837801696495:role/github-actions-role`

## A2) Add required GitHub secret(s)
In GitHub repo → **Settings → Secrets and variables → Actions**:

### Secrets
- `AWS_ROLE_ARN` = `arn:aws:iam::837801696495:role/github-actions-role`

### Variables (or secrets if workflow expects secrets)
- `AWS_REGION` = `us-east-1`

> Don’t paste secret values into chat. Just set them.

## A3) Re-run workflow
GitHub → **Actions → Build and Push** → open latest run → **Re-run jobs**.
Or push a tiny commit.

## A4) Verify images exist in ECR
AWS Console (region `us-east-1`) → **ECR → Repositories**:
- `ghost-engine-orchestrator-dev` → Images → confirm a tag `latest` exists
- `ghost-engine-worker-dev` → Images → confirm a tag `latest` exists

## A5) Force ECS services to redeploy (pull new images)
AWS Console → ECS → Cluster `ghost-engine-cluster-dev`:

- Service `orchestrator` → **Update** → check **Force new deployment**
- Service `worker` → **Update** → check **Force new deployment**

## A6) Verify ALB endpoint
Once targets are healthy, test:
- `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/healthz`

If still 503, check EC2 → Target Groups → `ghost-engine-orch-tg-dev` → Targets tab.
You want **1 Healthy** target.

---

# Option B — Manual build & push to ECR (fastest “get live now”)

> Requires Docker installed and running on the machine doing the steps.
> Requires AWS CLI configured for the same AWS account and region.

## B1) Authenticate Docker to ECR
PowerShell:
```powershell
aws ecr get-login-password --region us-east-1 |
  docker login --username AWS --password-stdin 837801696495.dkr.ecr.us-east-1.amazonaws.com
```

## B2) Build and push orchestrator
From repo root:
```powershell
docker build -t ghost-engine-orchestrator-dev:latest .\services\orchestrator
docker tag ghost-engine-orchestrator-dev:latest 837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-orchestrator-dev:latest
docker push 837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-orchestrator-dev:latest
```

## B3) Build and push worker
```powershell
docker build -t ghost-engine-worker-dev:latest .\services\worker
docker tag ghost-engine-worker-dev:latest 837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-worker-dev:latest
docker push 837801696495.dkr.ecr.us-east-1.amazonaws.com/ghost-engine-worker-dev:latest
```

## B4) Force ECS redeploy
AWS Console → ECS → Cluster `ghost-engine-cluster-dev`:
- Service `orchestrator` → **Update** → **Force new deployment**
- Service `worker` → **Update** → **Force new deployment**

## B5) Verify ALB endpoint
- `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/healthz`

---

# Troubleshooting quick hits

## If GitHub Action still fails
Open the failing workflow log and look for:
- `AWS_ROLE_ARN` missing/empty
- wrong region
- access denied assuming role
- permissions to ECR missing

If you see `AccessDenied` assuming role:
- confirm the workflow uses OIDC and the role ARN matches Terraform output
- confirm the repo string in terraform.tfvars is OWNER/REPO (not a URL)

## If ECS tasks run but target group unhealthy
Most common:
- health check path mismatch (should be `/healthz`)
- port mismatch (target group expects 8080)

---

# What Antigravity should report back after running either option
- ECR: do both repos now contain a `latest` image?
- ECS: do services show Running tasks = Desired tasks?
- Target group: do you see 1 Healthy target?
- ALB: does `/healthz` return 200?
