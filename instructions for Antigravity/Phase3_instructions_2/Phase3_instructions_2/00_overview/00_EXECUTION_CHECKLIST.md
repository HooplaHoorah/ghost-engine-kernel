# Phase 3 Execution Checklist (post-restructure)

This is the **definition-of-done** checklist for the *next* milestone after the monorepo reorg.

## A) Monorepo becomes buildable (local dev)

### Deliverables
- Root workspace tooling added (pnpm recommended; yarn/npm workspaces ok)
- Shared TypeScript base config
- Per-package scripts: `build`, `test`, `lint`
- One-command sanity run works from repo root

### Acceptance criteria
- `pnpm -w install` succeeds
- `pnpm -w test` succeeds
- `pnpm -w build` succeeds

See templates: `01_workspaces_templates/`

---

## B) Ghost Protocol schemas → generated TS types

### Deliverables
- `protocol/` contains versioned JSON Schemas (start with the moved `levelspec.v0.schema.json`)
- `protocol/` generates TS types into `protocol/generated/` via a script
- Types are imported by `kernel/` and `adapters/`

### Acceptance criteria
- `pnpm -w gen:types` (or similar) generates types deterministically
- No manual edits to generated files

See: `02_protocol_typegen/`

---

## C) Kernel deterministic loop (MVP)

### Deliverables
- `kernel/` exports:
  - `WorldState`
  - `InputFrame`
  - `tick(state, input, rng) -> { state, events }`
  - `createRng(seed)`
  - `hashState(state)`
  - `replay(initialState, inputFrames, seed)`
- Determinism tests (same seed + same inputs => identical state hash)

### Acceptance criteria
- Tests pass on CI
- Two separate runs produce the same hash output

See: `03_kernel_skeleton/`

---

## D) GE DOOM refactor (reference runtime)

### Deliverables
- `runtimes/ge-doom/` uses kernel as the **source of truth**
- Runtime contains only:
  - input collection
  - rendering / visualization
  - mapping kernel events to UI effects

### Acceptance criteria
- GE DOOM can run a replay file and end in the same final state hash

See: `05_ge_doom_refactor/`

---

## E) SampleProvider adapter (offline demo)

### Deliverables
- `adapters/sample-provider/` implements a provider interface that returns a tiny deterministic world
- Demo can run **without** Marble/API keys
- Provenance captured even for sample provider (seed, version, hashes)

### Acceptance criteria
- `pnpm -w ge-doom --provider sample --seed 123` (or equivalent) runs and is deterministic

See: `04_sample_provider/`

---

## F) CI wiring

### Deliverables
- GitHub Actions workflow that runs install/test/build
- Optional: determinism regression test job

See: `06_ci/`
