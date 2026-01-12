# How to apply these templates to the repo

This bundle includes *templates* (not direct patches) so Antigravity can adapt them to the new Phase 3 layout.

## 1) Root workspace setup
1. Copy:
   - `01_workspaces_templates/pnpm-workspace.yaml` → repo root
   - `01_workspaces_templates/tsconfig.base.json` → repo root
2. Merge `01_workspaces_templates/ROOT_package.json.template` into existing root `package.json` (do not delete existing scripts; move legacy ones under `cli/legacy_scripts` if needed).

## 2) Protocol package
1. Ensure `protocol/schemas/` contains existing `levelspec.v0.schema.json` and any new schemas.
2. Create/update `protocol/package.json` using `02_protocol_typegen/protocol.package.json.template`.
3. Add `protocol/scripts/generate-types.mjs` (from `02_protocol_typegen/scripts`).
4. Create `protocol/src/index.ts` and `protocol/tsconfig.json` from templates.

## 3) Kernel package
1. Create/update `kernel/package.json` from `03_kernel_skeleton/kernel.package.json.template`.
2. Copy `03_kernel_skeleton/src/*` → `kernel/src/*`.
3. Copy `03_kernel_skeleton/tests/*` → `kernel/tests/*`.
4. Ensure tests run via `pnpm -r test`.

## 4) SampleProvider adapter
1. Create `adapters/sample-provider/`.
2. Copy `04_sample_provider/*` into it.
3. Update imports/types to match your actual protocol types.

## 5) GE DOOM refactor
Use `05_ge_doom_refactor/GE_DOOM_REFACTOR_NOTES.md` as the map. Keep Phase 1 runnable, but route simulation through kernel.

