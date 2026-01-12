# GE DOOM refactor notes (Phase 3)

## Objective
Turn `runtimes/ge-doom/` into a **reference runtime** that:
- accepts a `WorldState` (kernel) + `events`
- renders + handles input
- does **not** own simulation rules

Phase 3 principle: **one authoritative world state exists independent of AI output**, and the same world state can drive ASCII + 3D viewers.

## Minimal architecture
1) Runtime collects input (keyboard/controller) → converts to `InputEvent`.
2) Runtime calls `tick(state, input, rng)` from `@ghost-engine/kernel`.
3) Runtime renders resulting state/events.
4) Runtime optionally records frames to a `ReplayLog`.

## Practical step-by-step
1) Create a small `runtimeDriver` module:
   - owns the `state` variable
   - owns the `rng` instance
   - calls `tick` at fixed timestep
2) Replace any direct mutation of runtime-level entities with `InputEvent`s.
3) Move any randomness (drops, enemy spawn chance) into kernel tick via `Rng`.
4) Add a "Determinism Debug" HUD:
   - show tick number
   - show `rng.getState()`
   - show `sha256Json(state)`

## Replay CLI hook (recommended)
Add a CLI command:
- `ge replay --log path/to/log.json`

This should run the kernel replay validation and print PASS/FAIL.

