# 01 — Fast Path (do this first)

## A) Confirm the failure (before)
```bash
export API_BASE_URL="http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com"
curl -sS "$API_BASE_URL/healthz"
curl -i -X POST "$API_BASE_URL/generate-scene" -H "content-type: application/json" \
  -d '{"prompt":"doom-bridge: tiny test dungeon","plugin":"doom-bridge"}'
```

## B) Apply Terraform so ECS gets env vars
From your terraform working dir:

```bash
terraform plan
terraform apply
```

**You should see task definition diffs** that add:
- JOBS_TABLE_NAME
- ARTIFACTS_BUCKET

## C) Force ECS rollout (if needed)
```bash
aws ecs update-service --cluster <cluster> --service <orchestrator_service> --force-new-deployment
aws ecs update-service --cluster <cluster> --service <worker_service> --force-new-deployment
```

Wait until services stable.

## D) Verify success (after)
```bash
curl -sS "$API_BASE_URL/healthz"
curl -sS -X POST "$API_BASE_URL/generate-scene" -H "content-type: application/json" \
  -d '{"prompt":"doom-bridge: tiny test dungeon","plugin":"doom-bridge"}'
```

Then poll:
```bash
curl -sS "$API_BASE_URL/status/<jobId>"
```

Open:
- http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/demo
- http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/play?job=<jobId>
