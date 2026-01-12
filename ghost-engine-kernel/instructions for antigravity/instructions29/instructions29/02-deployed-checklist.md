# 02 — Deployed Checklist (ALB)

## A) Get the ALB base URL
From the Terraform directory (where you applied the stack):

```bash
terraform output -raw alb_dns_name
```

Your base URL is:

```bash
export API_BASE_URL="http://$(terraform output -raw alb_dns_name)"
echo "$API_BASE_URL"
```

## B) Verify public reachability (no auth / no IP lock)
Run these from ANY machine on normal internet:

```bash
curl -i "$API_BASE_URL/healthz"
curl -I "$API_BASE_URL/demo"
curl -I "$API_BASE_URL/play"
curl -I "$API_BASE_URL/play.js"
curl -I "$API_BASE_URL/openapi.json"
```

Expected: 200 responses.

## C) Generate + Play (browser)
1. Open: `$API_BASE_URL/demo`
2. Click **Warmup**
3. Pick Doom preset (or a simple prompt)
4. Click **Generate**
5. After done:
   - click **Play (Browser)** in the UI
   - confirm you can move with WASD/arrow keys

## D) Artifact Proxy (CORS workaround)
From terminal, after you have a jobId:

```bash
curl -sS "$API_BASE_URL/artifact/<jobId>/levelSpec" | head
```

Expected: JSON.

## E) Provide the two links (copy/paste)
- Demo share link: `$API_BASE_URL/demo?jobId=<jobId>`
- Play link: `$API_BASE_URL/play?job=<jobId>`
