# Antigravity Task Spec — Phase 3 Buildability + Kernel MVP

You already completed the Phase 3 restructure. This packet covers the next milestone.

## Guiding principle
Ghost Engine Phase 3 = **open orchestration + determinism + provenance + eval + adapters**.

## Constraints
- Preserve Phase 1 + Phase 2: keep legacy runnable paths in `cli/legacy_scripts` and `runtimes/`.
- Kernel must be authoritative: runtimes consume state/events; they don’t simulate rules.
- Local-first demo: SampleProvider must run without any keys.

## Execute in this order
1) Workspaces + TS base (see `01_workspaces_templates/`)
2) Protocol package + typegen (see `02_protocol_typegen/`)
3) Kernel skeleton + determinism tests (see `03_kernel_skeleton/`)
4) Refactor GE DOOM to kernel (see `05_ge_doom_refactor/`)
5) SampleProvider adapter (see `04_sample_provider/`)
6) CI (see `06_ci/`)

## Output expected
- A set of PRs (PR plan included) that get CI green and demonstrate:
  - deterministic kernel replay
  - GE DOOM consuming kernel
  - SampleProvider generating deterministic LevelSpec / WorldSpec
