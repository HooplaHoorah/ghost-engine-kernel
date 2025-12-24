#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${BASE_URL:-http://localhost:8080}"
echo "Checking orchestrator..."
curl -fsS "$BASE_URL/health" >/dev/null
echo "Calling worker through orchestrator..."
curl -fsS "$BASE_URL/call-worker" >/dev/null
echo "OK"
