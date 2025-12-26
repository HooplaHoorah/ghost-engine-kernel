# 04 — Walkthrough Report (Template)

> Paste this filled report back to the Ghost Engine lead (this chat).

## 0) Summary (5–10 bullets)
- Environment: (local/deployed)
- Base URL:
- Outcome: (PASS / PARTIAL / FAIL)
- Biggest blockers:
- Biggest wins:

## 1) Environment + Build
- Mode: local | deployed
- Base URL:
- Date/time (local):
- Commit SHA / build tag (if known):
- Browser used (Chrome/Edge/etc.):

## 2) Preflight Results
- `{BASE_URL}/healthz` status:
- Notes from healthz payload (warnings/deps):
- `{BASE_URL}/demo` status:
- `{BASE_URL}/openapi.json` loads?:
- Any console errors on /demo?:

## 3) Browser Walkthrough Results
### Warmup
- Result:
- Duration:
- Any warnings:

### Primary generation run (doom-bridge)
- Prompt used:
- Plugin:
- jobId:
- seed:
- Total time:
- Artifact(s) produced:
- Any UI/UX issues observed:

### Share link
- Link format:
- Opened in new tab successfully?:
- Notes:

### Replay / determinism
- replay jobId:
- seed same as original?:
- LevelSpec match method:
  - ( ) byte-equal JSON
  - ( ) semantically equal
  - ( ) mismatch
- Notes on differences (if any):

### Play / Launch
- Launch method: UI launch | CLI runtime
- Controls OK?:
- Key/door/exit loop works?:
- Enemy behavior OK?:
- Any bugs:

### Odd prompt / failure-tolerant run
- Prompt:
- Result:
- Notes:

## 4) Readiness Report Output
Paste the full output of:

```bash
API_BASE_URL={BASE_URL} node scripts/demo-readiness-report.js --determinism --md
```

## 5) Evidence (links or attachments)
- Screenshots (list):
- Screen recording (if any):
- Job status URLs (list):
- LevelSpec JSON files (if you can attach / paste links):

## 6) Recommendations (prioritized)
List the top 5 next actions to improve:
1.
2.
3.
4.
5.

## 7) Open Questions / Unknowns
Anything you couldn’t verify:
- ...
