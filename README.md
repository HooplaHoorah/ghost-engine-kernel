# Ghost Engine Kernel

Serverless, agent-native runtime for orchestrating multi-modal AI + game/scene graphs. Built for Google Cloud Run, with ADK/A2A + MCP adapters.

## Status
Initial scaffold. PR seeds structure, policies, and Cloud Run manifest.

## Quick links
- Docs: ./docs/
- Whitepaper draft: ./whitepaper/
- Services: ./services/
- Packages: ./packages/
- Infra: ./infra/

## Utility scripts
- `scripts/judge-demo.sh` – Demonstrates calling a hosted Ghost Engine Judge API. The
  script requires the Google Cloud CLI (`gcloud`) for authentication and `curl`
  for issuing the HTTPS request.

## DevPost checklist
- [ ] Cloud Run service boot + healthcheck
- [ ] Minimal orchestrator service
- [ ] A2A schemas package stub
- [ ] MCP adapter stub
- [ ] Example scene ECS demo

## License
Apache-2.0
