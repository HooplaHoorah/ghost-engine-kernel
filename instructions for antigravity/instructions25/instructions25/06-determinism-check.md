# 06 — Determinism / Replay Expectations

## What “deterministic” should mean for the demo
Given same:
- prompt
- plugin
- seed
- pluginVersion (if tracked)
- specVersion

We expect:
- LevelSpec content is identical (ideal) OR semantically equivalent (acceptable)
- The gameplay-relevant structure is unchanged:
  - grid size
  - start pos
  - key/door/exit positions
  - enemy count/placement

## Acceptable sources of nondeterminism (if present)
- timestamps
- generated IDs that are not gameplay-relevant
- ordering of JSON keys (if stringifying differs)

## How to check quickly
1) Download both JSON artifacts (original + replay)
2) Compare:
- byte compare: `cmp -s a.json b.json`
- hash compare: `shasum -a 256 a.json b.json`

If mismatch:
- explain which fields differ
- whether the map layout differs
- whether the play experience differs
