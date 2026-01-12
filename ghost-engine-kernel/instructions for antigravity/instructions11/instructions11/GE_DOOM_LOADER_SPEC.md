# GE Doom Loader Spec (implementation guidance)

## Module layout (suggested)
- `ge/levelspec/LevelSpecTypes.*`
- `ge/levelspec/LevelSpecValidator.*`
- `ge/levelspec/LevelSpecLoader.*`
- `ge/levelspec/LevelBuilder.*`
- `ge/levelspec/EntitySpawner.*`

## Loader responsibilities
1) Input:
   - local file path OR URL to `levelSpec.json`
2) Parse JSON
3) Validate against schema (fail fast with readable error)
4) Build level:
   - convert tile coords to world coords
   - instantiate walls/floors
   - carve doors/openings
   - spawn entities
5) Start player at spawn
6) Register exit trigger

## Geometry strategy (minimum viable)
### Grid representation
- Create a 2D grid of tiles; each tile is `SOLID` or `EMPTY`
- Initialize all SOLID
- For each room rectangle:
  - set interior tiles to EMPTY
  - keep boundary tiles SOLID (walls)
- For each connection door:
  - find boundary wall tiles between rooms (shared edge preferred)
  - carve a 1–2 tile opening (set to EMPTY)
  - optionally place a “door” entity that can open/close

### Coordinate conversion
- worldX = tileX * tiles.size
- worldY = tileY * tiles.size
- (map to your engine’s axes; e.g., Doom uses X/Y plane and Z height)

## Door + key logic
- For locked doors, store required `keyId`
- Key pickup adds `keyId` to inventory
- Door interaction checks inventory before opening

## Enemy minimum
- Spawn 1 enemy prefab for entities with `type="enemy"`
- If AI is too heavy, make it a stationary hazard for v1

## Exit minimum
- Exit is a trigger volume; touching it ends level (“win”)

