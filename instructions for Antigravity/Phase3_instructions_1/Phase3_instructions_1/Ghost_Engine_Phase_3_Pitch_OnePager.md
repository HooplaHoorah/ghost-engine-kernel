# Ghost Engine (Phase 3) — CodeLaunch Positioning One-Pager

## The problem
AI can generate worlds, but shipping *interactive* experiences still breaks on:
- nondeterminism (can't reproduce issues)
- engine lock-in
- missing provenance (what prompt/seed/model created this?)
- regression risk when a provider updates
- cost explosions without caching/policy

## The solution
**Ghost Engine is the open-source interoperability kernel that turns Large World Model outputs into playable worlds.**

Ghost Engine OSS = **open orchestration + determinism + provenance + eval + adapters**.

## Demo (2 minutes)
1) Prompt → 2) Provider (Marble) → 3) Ingest → 4) Playable loop → 5) Replay determinism → 6) Provenance + cache → 7) Eval pass/fail

## Why now (CES signal)
- New AI compute platforms are slashing inference cost (more worlds, more variants)
- AI is moving to consumer surfaces (TVs/projectors) — interactive media must be portable

## Business wedge
Open-source core + paid cloud (orchestration/caching/eval) + marketplace for adapters/eval packs/exporters.
