# CI Gate (post-deploy smoke)

## 1) Decide how CI knows the deployed URL
Pick ONE:

### Option A (fastest): store it as a secret
- Add GitHub Secret: `API_BASE_URL` = `https://<your-alb-dns>`
- Smoke step uses that secret

### Option B (best): pull from Terraform outputs
- Terraform writes an output `alb_url`
- Workflow reads it (via `terraform output -raw alb_url`) and passes to smoke

## 2) Wire the smoke test after deploy
Example job (adjust to your workflow names):

```yaml
smoke-test:
  runs-on: ubuntu-latest
  needs: [deploy]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
    - run: node scripts/smoke.mjs
      env:
        API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

## 3) Make smoke output “debug-friendly”
Update `scripts/smoke.mjs` (optional):
- on failure, print last status payload
- if presigned URLs exist, try fetching them and validate content-type / non-empty body

## 4) Fail fast on partial deploy
If your deploy updates Orchestrator and Worker separately, ensure `needs: [deploy]` only triggers after BOTH are updated.

