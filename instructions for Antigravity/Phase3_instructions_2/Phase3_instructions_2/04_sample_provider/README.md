# SampleProvider (offline world provider)

## Objective
Provide an **offline** provider that always works on a judge laptop:
- no API keys
- no network calls
- deterministic output from `(prompt, seed)`

This provider is also the “Phase 1 preservation bridge”: it can emit the same `LevelSpec` schema used by the existing worker/runtime.

## Interface (suggested)
Until `adapters/` is formalized, keep a tiny interface local to the provider:

```ts
export interface WorldProvider<TWorldSpec> {
  id: string;
  version: string;
  generate(args: { prompt: string; seed: number }): Promise<{ world: TWorldSpec; provenance: any }>;
}
```

## What to implement
- `generate({prompt, seed})` returns:
  - `world`: a minimal LevelSpec (validate against the schema)
  - `provenance`: `{ prompt, seed, providerId, providerVersion, worldHash }`

