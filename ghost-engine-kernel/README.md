# Ghost Engine Kernel

**Mission**: Open orchestration + determinism + provenance + evaluation + adapters.

Ghost Engine is an open‑source interoperability kernel that turns outputs from large world models into **deterministic, playable worlds**. It solves the problems of non-determinism, engine lock-in, and missing provenance in AI-generated interactive experiences.

## Architecture

*   **Protocol**: Stable schemas for WorldState, AssetManifest, and Interactions.
*   **Kernel**: Deterministic simulation core.
*   **Adapters**: Pluggable system for connecting to Generative AI models.
*   **Services**: Orchestration, Ingestion, and Worker nodes.
*   **Runtimes**: Reference implementations (e.g., GE Doom).

## Quick Start
*(Coming Soon)*

## Repository Structure

*   `protocol/`: JSON schemas & TS definitions.
*   `kernel/`: Deterministic simulation core.
*   `adapters/`: Adapter SDK & implementations.
*   `services/`: Microservices (Orchestrator, Worker, Ingest).
*   `runtimes/`: Reference runtimes.
*   `cli/`: Command-line tools.
*   `exporters/`: Transmedia exporters.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
