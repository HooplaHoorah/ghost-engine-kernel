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

## DevPost checklist
- [ ] Cloud Run service boot + healthcheck
- [ ] Minimal orchestrator service
- [ ] A2A schemas package stub
- [ ] MCP adapter stub
- [ ] Example scene ECS demo

## License
Apache-2.0

## Judge Demo
- `/status` dashboard URL pattern: `https://<your-cloud-run-service>/status`
- `AGENT_MODE` toggle command: `gcloud run services update ghost-engine --set-env-vars=AGENT_MODE=judge`
- Run `./scripts/judge-demo.sh demo` to launch the judge demo workflow.
