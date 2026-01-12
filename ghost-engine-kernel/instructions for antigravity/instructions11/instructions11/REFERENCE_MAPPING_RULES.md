# Reference Mapping Rules (LevelSpec → GE Doom)

## Tile units
- LevelSpec coordinates are in **tile units**
- `tiles.size` indicates world units per tile (recommend 64)

## Coordinate system
Pick and freeze one mapping:
- `tileX` → world X
- `tileY` → world Y
- Z/height: fixed floor/ceiling for now

## Rooms
- Each room rectangle becomes a carved-out area
- Boundary is walls
- Interior is floor

## Doors
- Carve opening on shared wall if rooms touch
- If not touching, pick nearest walls and create a corridor (optional future)
For v0, prefer generating touching rooms or store explicit door positions.

## Entities
- Treat entity x/y as **absolute tile coords**
- Convert to world coords and spawn prefabs

## Locked doors
- `connections[].locked=true` means door requires keyId
- key pickup enables opening

## Determinism
- The game should not randomize placement
- Any “default decisions” (like door placement) must be deterministic:
  - use a stable function based on (fromId,toId) ordering
  - avoid unordered hash maps iteration differences

