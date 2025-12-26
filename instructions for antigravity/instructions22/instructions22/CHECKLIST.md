# Checklist — Definition of Done (Slice 17 / instructions22)

## Script
- [ ] `scripts/demo-readiness-report.js` exists
- [ ] Prints /healthz JSON and pass/fail summary
- [ ] Runs mini smoke job (doom-bridge, seed 777) and validates artifacts
- [ ] Prints pluginVersion
- [ ] Generates 3 backup links (unless skipped) and prints JSON blob
- [ ] Prints final READY / NOT READY status with failed sections
- [ ] Exits non-zero if not ready but still prints partial results

## Optional workflow
- [ ] `.github/workflows/demo-readiness-report.yml` exists
- [ ] Runs on workflow_dispatch
- [ ] Uses secrets.API_BASE_URL
- [ ] Uploads report log artifact

