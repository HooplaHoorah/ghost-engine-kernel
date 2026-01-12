# Ghost Engine Phase 3 Architecture

## Overview
This document outlines the architectural boundaries and relationships between Phase 1, 2, and 3 components.

## Core Hierarchy (Phase 3)
The Phase 3 architecture is "protocol-first" and "kernel-centric".

1.  **Protocol** (`@ghost-engine/protocol`): Single source of truth for schemas.
2.  **Kernel** (`@ghost-engine/kernel`): Deterministic game loop (`tick`), state management, and replay logic. Depends on `Protocol`.
3.  **Adapters** (`@ghost-engine/sample-provider`): Providers for generating `LevelSpec`s. Depend on `Protocol` and `Kernel`.
4.  **Runtimes** (`@ghost-engine/ge-doom`): "Dumb" clients that consume the Kernel state and render it. Depend on `Protocol` and `Kernel`.
5.  **CLI** (`@ghost-engine/cli`): Orchestrator for local development and demos.

## Legacy & Migration (Phase 1 & 2)

### Phase 1 (ASCII GE DOOM loop)
- **Status**: Refactored into `runtimes/ge-doom`.
- **Logic**: Simulation logic moved to `kernel`.
- **Assets**: ASCII rendering remains in runtime.

### Phase 2 (3D exploration)
- **Status**: Archived/Preserved.
- **Location**: Use `examples/phase2/` or `runtimes/phase2-*` for future prototyping using Phase 3 Kernel.
