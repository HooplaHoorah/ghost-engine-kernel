# Web Runtime MVP (GE DOOM Web)

## Minimal contract assumptions (adapt to your LevelSpec v0)
- `version`
- map/grid definition (width/height + tiles) OR rooms list you can rasterize
- entities: playerStart, key, door/exit

## Controls
- Movement: WASD + Arrow keys
- Interact: auto-pickup key, auto-open door if key present
- Win: reach exit when unlocked

## Rendering
### Option A (fast): ASCII
Characters:
- wall: '#'
- floor: '.'
- player: '@'
- key: 'k'
- locked exit: 'X'
- unlocked exit: 'E'

### Option B (better): Canvas
- Render tiles as rectangles
- Render player/entity as simple colored blocks

## UX
- Top bar shows: Job id, Seed, Hash
- If load fails: retry + proxy + CLI fallback
