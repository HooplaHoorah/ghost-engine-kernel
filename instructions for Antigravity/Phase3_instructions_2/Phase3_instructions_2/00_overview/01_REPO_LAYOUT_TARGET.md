# Target repo layout (Phase 3)

This is the intended **kernel-first** monorepo layout. Adapt names as needed, but keep the separation of concerns.

```
.
├─ protocol/                   # Ghost Protocol schemas + generated types
├─ kernel/                     # Deterministic simulation core (authoritative state)
├─ adapters/                   # World providers, model adapters, ingestion adapters
│  └─ sample-provider/
├─ exporters/                  # ...later (web/video/engine export)
├─ services/                   # optional orchestration services
│  ├─ orchestrator/
│  ├─ worker/
│  └─ infra/
├─ runtimes/
│  └─ ge-doom/                  # reference runtime (viewer) consuming kernel
├─ cli/
│  ├─ ge/                       # future CLI (thin orchestrator)
│  └─ legacy_scripts/           # preserved Phase 1/2 scripts
├─ examples/                    # preserved demo assets + minimal examples
├─ docs/                        # walkthoughs, devpost artifacts, diagrams
├─ tests/                       # integration tests spanning packages
└─ .github/workflows/
```

Principle: **AI output is never authoritative world state**. Providers propose *assets/specs*; kernel decides state & tick.
