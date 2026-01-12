# Deployed Walkthrough Report (ALB)

**Date:** 2025-12-26
**Environment:** Deployed (ALB)
**Branch:** `fix/demo-hardening-v2` (Merged)

## 1. Deployed Verification

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Health Check** | ✅ Pass | `GET /healthz` returns 200/OK. |
| **Warmup** | ✅ Pass | Clicked "Warmup" -> "Warmup OK" (S3/DDB checks confirmed). |
| **Generate** | ✅ Pass | Doom preset generated successfully. Artifacts presigned. |
| **Play Command** | ✅ Pass | `curl -L ...` command works on Mac/Linux. |
| **Rate Limiting**| ✅ Pass | Rapid clicks on "Generate" are disabled by UI; 429s handled gracefully. |

## 2. Issues

- None observed on ALB.

## 3. Play Command

Verified working command:
```bash
curl -L "<presigned-url>" -o level.json && node ge-doom/runtime.js --levelSpec level.json
```

---
*Ready for Stage sign-off.*
