#!/usr/bin/env bash
set -euo pipefail
docker compose -f infra/local/docker-compose.yml up -d --build --wait

echo "Checking /healthz..."
curl -fsS http://localhost:8080/healthz >/dev/null || (echo "Orchestrator healthz failed" && exit 1)
curl -fsS http://localhost:8081/healthz >/dev/null || (echo "Worker healthz failed" && exit 1)

echo "Triggering job..."
# Use grep/sed to simplistic parse JSON if jq not available, assuming simple format
RESPONSE=$(curl -fsS -X POST -H "Content-Type: application/json" -d '{"prompt":"test scene"}' http://localhost:8080/generate-scene)
echo "Response: $RESPONSE"

if [[ "$RESPONSE" != *"job_id"* ]]; then
  echo "Failed to get job ID in response"
  exit 1
fi

echo "Smoke test passed"
docker compose -f infra/local/docker-compose.yml down
