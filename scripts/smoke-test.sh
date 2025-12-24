#!/usr/bin/env bash
set -euo pipefail
docker compose -f 06_infra/local/docker-compose.yml up -d --build
curl -fsS http://localhost:8080/health >/dev/null
curl -fsS http://localhost:8081/health >/dev/null
curl -fsS http://localhost:8080/call-worker >/dev/null
docker compose -f 06_infra/local/docker-compose.yml down
echo "OK"
