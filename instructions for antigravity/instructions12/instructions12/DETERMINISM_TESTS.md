# Determinism Regression Tests

## Why
Determinism is a core credibility point: “same prompt+seed gives same playable level.”

## A) Backend determinism test
Add a script (or extend smoke) that:
1) Generates a job with `doom-bridge` + seed
2) Replays it (POST /jobs/:id/replay) to create a second job
3) Downloads both LevelSpecs
4) Computes sha256 (canonicalized JSON recommended)
5) Asserts hashes match

## B) Game determinism test
In GE Doom loader/builder:
- After building the tile grid, compute a stable hash of the grid (and optionally entities).
- Log it (and show in debug overlay).

When loading the same LevelSpec twice, hash must match.

## Canonical JSON hashing (recommended)
If you see key-order differences:
- parse JSON
- re-serialize with stable key sorting
- hash the result
