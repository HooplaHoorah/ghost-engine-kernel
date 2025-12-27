# Submission Checklist (CodeLaunch / Demo-ready)

## Core demo
- [x] Public HTTPS URL works: `https://d3a3b2mntnsxvl.cloudfront.net/demo`
- [x] `POST /generate-scene` works
- [x] `/play?job=<id>` playable in-browser
- [x] Determinism story ready (seed/replay)
- [x] Two backup job links verified

## Observability
- [x] Dashboard exists (CPU/Mem + logs)
- [x] ALB 5xx alarm exists and is OK
- [x] Orchestrator high-CPU alarm exists and is OK
- [x] Log retention set (7 days ok)

## Docs / repo hygiene
- [x] README updated with demo URLs and quickstart
- [x] Demo pack script committed (`scripts/demo-pack.mjs`)
- [x] `demo-walkthrough/report-v3.md` committed
- [x] CloudFront infra committed in Terraform

## Evidence pack (for judges)
- [x] 3–6 screenshots (Warmup OK, Generate OK, Play running)
- [x] Link list (Demo base URL, Play link, backup links)
- [x] Short architecture diagram or bullet list
- [x] Known limitations documented (e.g. legacy DOOM rendering)

## Stage assets
- [x] Stage Run Sheet pinned
- [x] Demo Narrative finalized and practiced
- [x] Failure Playbook pinned
