# 05 — Report Template (paste back to ChatGPT)

**Date:** 2025-12-26  
**Environment:** Deployed (ALB)  
**Branch/Commit:** `<branch>` / `<sha>`  
**AWS Region:** `<region>`  

## 1) Base URL
`http://<alb_dns_name>`

## 2) Public Reachability
- [ ] Verified from non-VPN internet (incognito ok)
- [ ] No SSO/login wall
- [ ] No IP allow-listing required

## 3) Endpoint Checks (paste command + output snippets)
```bash
curl -i http://<alb_dns_name>/healthz
curl -I http://<alb_dns_name>/demo
curl -I http://<alb_dns_name>/play
curl -I http://<alb_dns_name>/play.js
curl -I http://<alb_dns_name>/openapi.json
```

## 4) External Smoke Output
```bash
API_BASE_URL="http://<alb_dns_name>" node scripts/external-smoke.mjs
```

## 5) Demo Evidence
- Demo share link: `http://<alb_dns_name>/demo?jobId=<jobId>`
- Play link: `http://<alb_dns_name>/play?job=<jobId>`
- JobId: `<jobId>`
- Seed: `<seed>`

## 6) Notes / Issues
- (anything odd: 429s, slow jobs, missing assets, CORS behavior, etc.)
