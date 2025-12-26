# Live Environment Validation (Deployed)

## 1) Manual “stage demo” checklist (5 minutes)
1. Open: `https://<ALB>/demo`
2. Run `stub` plugin:
   - verify steps render
   - verify minimap renders
   - verify artifacts links work (or inline fallback)
3. Run `doom-bridge` plugin with a seed (e.g., 12345):
   - verify `levelSpecUrl` and `levelPreviewAsciiUrl` appear (or inline)
   - click download links, confirm non-empty content
4. Open: `/docs` and ensure “Try it” works for generate/status
5. Open: CloudWatch dashboard and confirm:
   - job_duration_ms graph has datapoints
   - step_duration_ms has datapoints
   - jobs_failed_count is 0 during demo
6. Confirm GitHub Actions has a completed run with smoke-test green.

## 2) Programmatic validation (optional)
- Extend smoke script to:
  - fetch presigned URLs and validate bodies are non-empty
  - validate JSON parses for sceneGraph + levelSpec

## 3) CloudWatch quick setup
If EMF metrics exist but no dashboard:
- Add widgets:
  - Avg job_duration_ms (5m)
  - Sum jobs_failed_count (5m)
  - Avg step_duration_ms split by stepName (optional)

## 4) Regression drill (recommended once)
On a branch:
- intentionally break `/openapi.json` route or return 500
- deploy to a non-prod env
- confirm smoke-test fails
- revert
