# Slice 18 Plan — Readiness report upgrades

## A) Determinism flag
- Support CLI flag `--determinism`
- When present:
  - spawn `node scripts/backend-determinism-test.js`
  - capture exit code
  - print section “DETERMINISM: PASS/FAIL”
- If determinism fails, mark report NOT READY.

## B) Artifact verification summary
- Track counts:
  - attempted checks (each URL validation attempted counts as 1)
  - passed checks
- Print per section:
  - Mini smoke: “Artifacts verified: X/Y OK”
  - Demo pack: “Artifacts verified: X/Y OK” (aggregate across jobs)

Still print per-error diagnostics as you already do.

