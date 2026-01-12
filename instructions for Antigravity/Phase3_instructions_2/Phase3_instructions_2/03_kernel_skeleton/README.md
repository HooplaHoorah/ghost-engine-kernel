# Kernel skeleton (v0)

This is a minimal deterministic kernel loop intended to be copied into `kernel/`.

Key constraints:
- No non-deterministic sources inside `tick()` (no time, randomness must go through `Rng`).
- State transitions are pure (input + previous state + RNG state -> next state + events).
- Determinism is enforced by tests using stable hashing.

Next steps (after copy):
- Replace toy entities with your canonical WorldState (likely derived from Protocol v0.1 schemas)
- Add collision/nav interactions + event bus
- Add snapshot/restore + serializer formats
