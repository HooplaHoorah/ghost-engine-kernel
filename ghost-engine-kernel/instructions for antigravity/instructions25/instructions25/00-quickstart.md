# 00 — Quickstart (browser demo in <10 min)

## Choose your mode
- **Deployed**: use the ALB / public base URL (recommended for stage rehearsal)
- **Local**: `http://localhost:8080` (or whatever your Orchestrator binds to)

You can run both. If time is tight: run deployed first.

---

## A) Browser demo (minimum)
1. Open: `{BASE_URL}/healthz`  
   - Confirm HTTP 200 and note any `warnings` / dependency statuses.
2. Open: `{BASE_URL}/demo`
3. Click **Warmup**
4. Choose a preset prompt (or enter one), select plugin:
   - `doom-bridge` (preferred)
5. Click **Generate**
6. When complete:
   - Click **Share link**
   - Click **Replay** (if present) or run the replay action from the UI
   - Click **Play / Launch** (or download and launch via runtime)

---

## B) CLI checks (minimum)
From repo root:

```bash
API_BASE_URL={BASE_URL} node scripts/demo-readiness-report.js --determinism --md
```

Save the output into your report under “Readiness Report”.

---

## If anything breaks
Jump to:
- `03-troubleshooting.md`
- or capture the failure details per `05-data-to-capture.md` and move on.
