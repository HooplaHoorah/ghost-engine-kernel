# 05 — Report (Option B)

**Date:** 2025-12-26
**Environment:** Deployed (ALB)
**Branch:** fix/demo-hardening-v2
**AWS Region:** us-east-1

## 1) Base URL
`http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com`

## 2) Public Reachability
- [x] Verified from non-VPN internet (incognito ok)
- [x] No SSO/login wall
- [x] No IP allow-listing required

## 3) Endpoint Checks
```bash
$ curl -sS -I http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/healthz
HTTP/1.1 200 OK
Date: Fri, 26 Dec 2025 21:58:30 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 104
Connection: keep-alive
X-Powered-By: Express
ETag: W/"68-l2F8l7/0H3S5G2k/hO5/5s4q3m8"

$ curl -I http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/demo
HTTP/1.1 200 OK
Date: Fri, 26 Dec 2025 21:58:24 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 3559
Connection: keep-alive
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 26 Dec 2025 21:52:19 GMT
ETag: W/"de7-19b5cafbf81"

$ curl -I http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/play
HTTP/1.1 200 OK
Date: Fri, 26 Dec 2025 22:04:36 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 1885
Connection: keep-alive
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 26 Dec 2025 21:52:19 GMT
ETag: W/"75d-19b5caf3d38"

$ curl -I http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/play.js
HTTP/1.1 200 OK
Date: Fri, 26 Dec 2025 22:04:37 GMT
Content-Type: application/javascript; charset=UTF-8
Content-Length: 8527
Connection: keep-alive
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 26 Dec 2025 21:52:19 GMT
ETag: W/"214f-19b5caf3d38"

$ curl -I http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/openapi.json
HTTP/1.1 200 OK
Date: Fri, 26 Dec 2025 22:04:37 GMT
Content-Type: application/json; charset=UTF-8
Content-Length: 2649
Connection: keep-alive
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 26 Dec 2025 21:49:12 GMT
ETag: W/"a59-19b5cabb0e6"
```

## 4) External Smoke Output
```bash
External smoke against: http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com
✅ /healthz
✅ /openapi.json
✅ /demo
✅ /play
✅ /play.js
❌ /generate-scene failed: 500 {"error":"internal error"}
```

## 5) Demo Evidence
- Demo share link: `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/demo`
- Play link: `http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com/play`
- JobId: N/A (Generation failed)
- Seed: N/A

## 6) Notes / Issues
- **Generation Failure**: `/generate-scene` returns 500.
- **Root Cause**: The deployed ECS tasks are missing `JOBS_TABLE_NAME` and `ARTIFACTS_BUCKET` environment variables. 
  - Validated via `/healthz`: `DDB=false`, `S3=null`.
- **Action Required**: Run `terraform apply` again to ensure the latest Task Definition edits (which include these env vars) are pushed to AWS, or confirm the ECS service uses the latest Task Definition revision.
