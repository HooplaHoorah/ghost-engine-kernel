# Ghost Engine Demo Walkthrough Report

**Date:** 2025-12-26
**Environment:** Local (`http://localhost:8080`)
**Commit:** `59432e0f753a0198c0718477754b` (Branch: `main`)

## 1. Environment & Pre-flight

- **Orchestrator:** `http://localhost:8080` (Healthy)
- **Worker:** `http://localhost:8081` (Healthy)
  - *Note:* Worker required `PORT=8081` override to avoid conflict with Orchestrator on default port 8080.

### Pre-flight Checks
- `/healthz`: `{"ok":true,"time":"..."}`
- `/openapi.json`: Available.
- `demo-readiness-report.js`: **Missing** (File not found in scripts/).
- `demo-pack.js`: **Failed** (Exit Code 1 during test run), likely due to backend restart timing.

## 2. Browser Walkthrough Results

| Step | Action | Status | Notes | Screenshot |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Open Demo UI | ✅ Pass | Page loaded correctly. | `01_demo_page.png` |
| **2** | Warmup | ❌ Fail | **Button Missing** in UI. | (Skipped) |
| **3** | Generate (Doom) | ✅ Pass | Job: `b91f23a3...` Seed: `393671`. Artifacts generated. | `03_generate_success.png` |
| **4** | Share Link | ✅ Pass | URL preserved state. | `04_share_success.png` |
| **5** | Replay (UI) | ⚠️ Warn | **Button Unresponsive**. Click had no effect. | - |
| **6** | Replay (Manual)| ✅ Pass | Manually re-running seed produced valid job. | `05_replay_success.png` |
| **7** | Play / Launch | ❌ Fail | **Button Missing** (not implemented in this UI version?). | - |
| **8** | Failure Test | ✅ Pass | "Weird maze" prompt handled gracefully (Success). | `07_failure_test_final.png` |

## 3. Determinism Verification

We compared the `levelSpec` output from the initial run and the replay run (Seed `393671`).

- **Run 1 Job ID:** `b91f23a3-c054-48a0-a464-aece9330be27`
- **Run 2 Job ID:** `ff7d166b-e474-4680-bd00-ca4f74bc2205`
- **Result:** **MATCH** (JSON content is identical).

## 4. Issues & Failures

### Critical
1.  **Port Conflict (Local):** Both `orchestrator` and `worker` services default to `PORT=8080`. Attempting to start both with `npm start` caused the Worker to crash (`EADDRINUSE`).
    *   *Fix Applied:* Started Worker with `PORT=8081`.

### UI / Experience
2.  **Broken "Replay" Button:** Clicking "Replay Job" does nothing.
3.  **Missing Buttons:** Instructions mention "Warmup" and "Play", but neither exists in the current UI (`index.html`).
4.  **Error Handling:** When backend was down, UI showed generic "fetch failed" without user-friendly recovery instructions.

### Scripting
5.  **Missing Scripts:** `scripts/demo-readiness-report.js` referenced in instructions does not exist.

## 5. Recommendations

1.  **Config Update:** Change `services/worker/index.js` to default to port `8081` (or use `docker-compose` to manage ports) to ensure local dev works out-of-the-box.
2.  **UI Fixes:**
    - Implement the "Replay" button click handler.
    - Add the "Play" button (or link to runtime).
    - Remove "Warmup" from instructions if it's no longer a feature.
3.  **Documentation:** Update `instructions25` to reflect the current set of available scripts.

---
*Screenshots available in `demo-walkthrough/` folder.*
