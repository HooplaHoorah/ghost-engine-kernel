# instructions29 — Option B (Deployed ALB, Public Reachability)

**Goal:** make the deployed Ghost Engine demo reachable from the public internet (ALB) and produce a concrete, copy‑pasteable **base URL** + **evidence** so ChatGPT Agent can run the demo checks end‑to‑end.

This bundle assumes your AWS infra is already provisioned (Terraform) and that CI/CD deploys to ECS.

## Deliverables (what you must send back)
1) **ALB Base URL** (example): `http://<alb_dns_name>`
2) A short **walkthrough report** (use template in `05-report-template.md`)
3) Output from the **external smoke** script (snippet provided)

## Why this exists
We tried “Option A” (run from a local build zip inside ChatGPT’s sandbox) and it’s blocked by environment/file-path constraints.
So we switch to **Option B**: validate the already-deployed stack via its public ALB endpoint.

Start with: `01-scope-and-acceptance.md`
