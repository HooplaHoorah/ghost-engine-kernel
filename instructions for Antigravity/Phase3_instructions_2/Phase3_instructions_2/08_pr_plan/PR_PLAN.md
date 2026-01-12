# PR Plan (Phase 3 post-restructure)

This plan keeps changes reviewable and reduces the chance of breaking Phase 1/2 while building Phase 3.

## PR 1 — Workspaces + TypeScript base
**Scope**
- Add pnpm workspaces (or yarn/npm) at root
- Add `tsconfig.base.json`
- Add root scripts: `build`, `test`, `typecheck`

**Acceptance**
- `pnpm install` works at repo root
- `pnpm -r typecheck` passes (even if many packages are still placeholders)

## PR 2 — Protocol package + typegen
**Scope**
- Create `protocol/package.json` + `schemas/` + `scripts/generate-types.mjs`
- Generate types into `protocol/src/generated/`
- Export types via `protocol/src/index.ts`

**Acceptance**
- `pnpm -C protocol build` succeeds
- `pnpm -C protocol run generate` updates generated files

## PR 3 — Kernel skeleton + determinism tests
**Scope**
- Create `kernel/` TypeScript package with `WorldState`, `tick()`, `Rng`, replay log
- Add vitest determinism tests

**Acceptance**
- `pnpm -C kernel test` passes
- Determinism test compares full replay logs

## PR 4 — GE DOOM consumes kernel
**Scope**
- Refactor runtime to call `tick()` and render `WorldState`
- All randomness comes from `kernel/Rng`

**Acceptance**
- Runtime still runs locally
- Can run replay from a recorded log

## PR 5 — SampleProvider adapter (offline)
**Scope**
- Add `adapters/sample-provider` emitting existing LevelSpec or new WorldSpec
- Wire a CLI command to generate a level using SampleProvider

**Acceptance**
- Demo runs on a clean machine with no API keys

## PR 6 — CI
**Scope**
- Add GitHub Actions workflow that runs typecheck + tests

**Acceptance**
- CI is green on PRs
