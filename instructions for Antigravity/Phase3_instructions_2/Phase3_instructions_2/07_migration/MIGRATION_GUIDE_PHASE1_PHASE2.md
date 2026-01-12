# Preserving Phase 1 + Phase 2 while moving to Phase 3

## Non-negotiables
- **Do not delete** Phase 1 and Phase 2 artifacts; move them under clear namespaces.
- Keep Phase 1 runnable (even if “legacy”) for regression + demo fallback.
- Preserve git history by moving files (git mv) rather than copy/delete when possible.

## Recommended mapping

### Phase 1 (ASCII GE DOOM loop)
**Goal:** Keep the working demo as a reference runtime.
- Move existing `ge-doom/` to `runtimes/ge-doom/` (already done).
- Any existing level generation schema (e.g., `levelspec.v0.schema.json`) should live in `protocol/schemas/`.
- The old orchestrator/worker services can remain under `services/` but must depend on the **protocol + kernel** rather than owning logic.

### Phase 2 (3D exploration)
**Goal:** Preserve experiments without letting them dictate architecture.
- Move 3D prototypes to `examples/phase2/` or `runtimes/phase2-*`.
- Keep assets (meshes/textures) in a dedicated path (e.g., `examples/assets/phase2/`) and avoid bloating root.

## What to archive vs what to keep active
- **Active (Phase 3):** protocol/, kernel/, adapters/, runtimes/ge-doom/, cli/, tests/
- **Archive/legacy:** scripts moved to `cli/legacy_scripts`, old demo packaging scripts, hackathon-specific infra.

## Git hygiene
- Prefer `git mv` to preserve history.
- Add a `docs/ARCHITECTURE.md` that explains Phase 1/2/3 boundaries.
