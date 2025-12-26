# Ghost Engine — instructions8 (Slice 3: Hardening + Demo Ergonomics)

This bundle describes the next implementation slice for Ghost Engine after:
- Slice 1: demo contract + plugin pipeline + “wow” artifacts
- Slice 2: DynamoDB + S3 persistence + IAM wiring

## Outcomes
By the end of Slice 3, the deployed system should be:
- **Demo-friendly**: artifacts are returned as **clickable URLs** (presigned) or streamable endpoints.
- **Secure**: the Worker → Orchestrator step callback is authenticated.
- **Race-safe**: step/job updates are **idempotent** and **concurrency-safe** in DynamoDB.
- **Cost-controlled**: automatic retention/cleanup via DynamoDB TTL + S3 lifecycle.
- **Regression-proof**: a post-deploy **smoke test** runs in CI against the live ALB.
- **Observable**: basic job/step duration and error metrics are emitted and surfaced.

## Contents
- `SLICE3_PLAN.md` — requirements + acceptance criteria
- `APP_CHANGES.md` — implementation notes + snippets
- `TERRAFORM_CHANGES.md` — HCL diffs / guidance
- `CI_SMOKE_TEST.md` — script + workflow snippet
- `CHECKLIST.md` — Definition of Done
- `NOTES.md` — extra tips
