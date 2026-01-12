# LevelSpec Schema v0 (contract)

## File: `levelSpec.json`
The `doom-bridge` plugin emits a JSON document that the GE Doom build ingests.

### Required top-level fields
- `version` (string) — `"0"`
- `seed` (integer)
- `units` (string) — `"tile"`
- `tiles.size` (integer) — recommended default 64
- `rooms[]` (array of room objects)
- `connections[]` (array)
- `entities[]` (array)
- `spawn` (object)
- `exit` (object)

### Room object
- `id` (string)
- `x`,`y` (integer) — tile coords (top-left)
- `w`,`h` (integer) — size in tiles
- `theme` (string) — optional/ignored by engine at first

### Connection object
- `from`,`to` (string room ids)
- `type` (string) — `"door"`
- `locked` (boolean) — optional default false
- `keyId` (string) — required if locked=true

### Entity object
- `id` (string)
- `type` (string) — `"key" | "enemy" | "health" | "ammo" | ...`
- `subtype` (string) — optional (enemy types, etc.)
- `roomId` (string)
- `x`,`y` (integer) — tile coords within room (or absolute; pick one and document)
Recommended: **absolute tile coords** for simplicity.

### Spawn/Exit
- `roomId` (string)
- `x`,`y` (integer) — tile coords

## Notes
- Determinism: the same LevelSpec should always yield the same geometry placement.
- Keep field ordering stable if you care about byte-for-byte hashing; otherwise hash canonicalized JSON.

See also: `templates/levelspec.v0.schema.json`.

