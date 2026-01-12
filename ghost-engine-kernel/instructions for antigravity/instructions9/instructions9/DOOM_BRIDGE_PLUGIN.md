# GE Doom Bridge Plugin (`doom-bridge`)

## Goal
Take the existing `sceneGraph` output and turn it into a stable, deterministic “LevelSpec” artifact suitable for GE Doom ingestion.

This is intentionally **not** a full WAD/UDMF exporter yet. It’s a bridge artifact that lets the GE Doom side iterate fast.

---

## Request contract
Extend `POST /generate-scene` to accept:
```json
{
  "prompt": "…",
  "plugin": "doom-bridge",
  "seed": 12345
}
```

Rules:
- If `seed` missing, generate one server-side and return it in the job record so replays are possible.
- Deterministic guarantee is **for identical prompt + seed + pluginVersion**.

---

## LevelSpec schema (v0)
Produce `levelSpec.json` shaped like:

```json
{
  "version": "0",
  "seed": 12345,
  "units": "tile",
  "tiles": { "size": 64 },
  "rooms": [
    {
      "id": "r1",
      "x": 0, "y": 0,
      "w": 6, "h": 4,
      "theme": "stone"
    }
  ],
  "connections": [
    { "from": "r1", "to": "r2", "type": "door", "locked": true, "keyId": "k1" }
  ],
  "entities": [
    { "id": "k1", "type": "key", "roomId": "r2", "x": 2, "y": 1 },
    { "id": "e1", "type": "enemy", "subtype": "imp", "roomId": "r3", "x": 3, "y": 2 }
  ],
  "spawn": { "roomId": "r1", "x": 1, "y": 1 },
  "exit":  { "roomId": "r3", "x": 4, "y": 2 }
}
```

### Mapping guidelines
- Rooms come from `sceneGraph.rooms`
- Doors/connections from `sceneGraph.doors`
- Items/enemies from `sceneGraph.items/enemies` (or your current naming)
- Use a seeded RNG to place or adjust positions when not provided

---

## Determinism (seeded RNG)
Use a deterministic PRNG (e.g., mulberry32/xorshift) seeded by the integer `seed`.

### Minimal JS PRNG (mulberry32)
```js
export function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Rules:
- Never call `Math.random()` in the doom-bridge path
- Keep iteration order stable (sort by id before mapping if needed)
- Emit JSON with stable key ordering if you need byte-for-byte equality across runs

---

## Worker implementation plan
1) Add plugin registration `doom-bridge`
2) Implement `emit_level_spec` step (or reuse `emit_level_stub` but branch by plugin)
3) Output `levelSpec`:
   - inline in demo mode
   - offloaded to S3 in persistent mode (return key and let Orchestrator presign to `levelSpecUrl`)

---

## Acceptance tests
- Same prompt+seed twice yields identical `levelSpec` (semantic AND preferably byte-for-byte)
- `GET /status/:id` returns `levelSpecUrl` in persistent mode
- Demo UI can display a readable preview or download link for LevelSpec

