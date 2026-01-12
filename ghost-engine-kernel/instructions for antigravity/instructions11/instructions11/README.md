# Ghost Engine — instructions11
## Slice 6: GE Doom Ingestion + One-Button “Prompt → Play” Loop

You now have:
- deterministic `doom-bridge` plugin producing `levelSpec`
- `/demo` UI with share links + replay
- guardrails (rate limit + concurrency cap)
- CI smoke gate + EMF metrics

Slice 6 turns the pipeline into a **playable** demo:
**Prompt → Generate → Download/Fetch LevelSpec → Load in GE Doom → Play → Exit triggers win**

### Outcomes
1) **GE Doom loads LevelSpec** and builds a navigable micro-level with doors, key lock, enemy, exit.
2) **One-button workflow** to fetch & load a generated level from a jobId.
3) **Schema contract** is frozen (versioned) and validated on both backend and game side.
4) **Determinism verified end-to-end** (same prompt+seed → same play layout).

### Contents
- `SLICE6_PLAN.md`
- `LEVELSPEC_SCHEMA.md`
- `GE_DOOM_LOADER_SPEC.md`
- `ONE_BUTTON_WORKFLOW.md`
- `REFERENCE_MAPPING_RULES.md`
- `ACCEPTANCE_TESTS.md`
- `CHECKLIST.md`
- `templates/` (JSON schema + CLI script skeletons)

