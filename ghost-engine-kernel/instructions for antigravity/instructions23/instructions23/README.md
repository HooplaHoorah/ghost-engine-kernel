# Ghost Engine — instructions23
## Slice 18: Readiness Report Upgrades (Determinism Flag + Artifact Verification Summary)

Slice 17 delivered:
- `scripts/demo-readiness-report.js`
- optional GitHub Action workflow

Slice 18 makes the report even more persuasive and actionable:

### Outcomes
1) Add `--determinism` flag to readiness report:
   - runs `scripts/backend-determinism-test.js`
   - includes PASS/FAIL section in the report
2) Add artifact verification summary counts:
   - track how many artifact URL checks were attempted and passed
   - print “Artifacts verified: X/Y OK” in mini-smoke and demo pack sections
3) Ensure failures are still visible, but the report is more readable.

### Contents
- `SLICE18_PLAN.md`
- `DETERMINISM_FLAG.md`
- `ARTIFACT_SUMMARY.md`
- `CHECKLIST.md`
- `templates/` (patch snippets)

