# Checklist — Definition of Done (Slice 18 / instructions23)

## Determinism flag
- [ ] `demo-readiness-report.js` supports `--determinism`
- [ ] Runs `scripts/backend-determinism-test.js` when flag present
- [ ] Prints determinism PASS/FAIL section
- [ ] Determinism failure marks final status NOT READY (exit 1)

## Artifact summary
- [ ] Tracks attempted/passed artifact URL validations
- [ ] Prints “Artifacts verified: X/Y OK” in mini smoke section
- [ ] Prints aggregate artifact summary in demo pack section

