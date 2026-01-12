# Phase3_instructions_2

This bundle is the **next execution packet** for Google Antigravity after the Phase 3 repo restructure.

Goal: make the new monorepo **buildable**, establish **Ghost Protocol → TypeScript types**, implement the **kernel deterministic loop**, refactor **GE DOOM** into a reference runtime that consumes the kernel, and ship an **offline SampleProvider** so the demo runs without external credentials.

## Recommended PR order (high level)
1) Workspaces + build plumbing
2) Protocol package + type generation
3) Kernel skeleton + determinism tests
4) GE DOOM runtime refactor to kernel
5) SampleProvider adapter + offline demo path
6) CI wiring

See:
- `00_overview/00_EXECUTION_CHECKLIST.md`
- `08_pr_plan/PR_PLAN.md`

