# Acceptance Tests (Slice 6)

## Test 1: Happy path — Prompt → Play
1) Go to `/demo`
2) Generate with plugin `doom-bridge`, seed `12345`
3) Copy jobId from metadata
4) Run: `ge-fetch <jobId>`
5) GE Doom launches and loads the level
6) Player can:
   - navigate rooms
   - pick up key
   - open locked door
   - reach exit and trigger win

## Test 2: Replay determinism
1) Generate job A with seed 777
2) Replay job A (POST /jobs/:id/replay) to create job B
3) Fetch both `levelSpecUrl` and compute hash:
   - hash(levelSpecA) == hash(levelSpecB)
4) Load both in GE Doom; layout is identical

## Test 3: Invalid LevelSpec handling
- Remove a required field and ensure loader fails with a readable error (no crash)

## Test 4: Locked door without key
- Ensure you cannot open locked door before picking up key

