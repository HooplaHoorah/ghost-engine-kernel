# Fix Plan (PR checklist) - DONE

## Fix 1 — Worker default port conflict (HIGHEST PRIORITY)
**Status: FIXED**
- Changed `services/worker/index.js` default port to 8081.

## Fix 2 — /demo UI demo-critical actions
**Status: FIXED**
- **Replay:** Fixed event listener in `demo.js`. Verified manually and with V2 walkthrough.
- **Warmup:** Added button to `index.html`. Wired to `/healthz` check.
- **Play:** Added button to `index.html`. Shows `curl ... && node ge-doom/runtime.js` command.

## Fix 3 — Scripts parity with instructions
**Status: FIXED**
- Restored `scripts/demo-readiness-report.js`.

---
PR ready for `fix/demo-hardening-v2`.
