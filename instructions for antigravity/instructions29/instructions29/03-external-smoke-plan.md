# 03 — External Smoke (scripted verification)

This is the key piece that makes “Option B” reliable.

## What to do
1) Copy `snippets/external-smoke.mjs` into repo as `scripts/external-smoke.mjs`
2) Add a workflow (optional) from `snippets/workflows/smoke-deployed.yml`
3) Run:

```bash
API_BASE_URL="http://<alb_dns_name>" node scripts/external-smoke.mjs
```

## What it proves
- ALB is reachable from outside (not just from your laptop/VPC)
- `/demo` and `/play` assets are served
- `/generate-scene` works against real ECS worker
- proxy endpoint returns the LevelSpec
- produces the exact shareable URLs you should paste back into ChatGPT
