# Protocol → TypeScript type generation

## Objective
Turn JSON Schemas in `protocol/schemas/` into importable TypeScript types in `protocol/src/generated/`.

This supports Phase 3’s “protocol-first” stance: runtimes, kernel, adapters all depend on the same versioned schemas.

## Recommended approach
- Keep schemas as the source of truth (JSON Schema).
- Generate TS types using `json-schema-to-typescript`.
- Commit the generated `.ts` files to keep CI fast and avoid toolchain drift **or** generate in CI — pick one and be consistent.

## Template files in this folder
- `protocol.package.json.template`
- `protocol.tsconfig.json`
- `scripts.generate-types.mjs`

## Suggested repo wiring
```
protocol/
  schemas/
    levelspec.v0.schema.json
    ...
  src/
    generated/
      levelspec.v0.ts
    index.ts
  scripts/
    generate-types.mjs
```

## Commands (pnpm)
```bash
cd protocol
pnpm add -D json-schema-to-typescript glob
pnpm add -D typescript
pnpm run gen:types
pnpm run build
```

## Output contract
- Generated file names should be stable and deterministic.
- `protocol/src/index.ts` should re-export the generated types.
