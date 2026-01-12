#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   BASE_URL="http://localhost:8080" ./scripts/commands.sh

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "== Health check =="
curl -fsS "${BASE_URL}/healthz" | head -c 400 || true
echo
echo

echo "== OpenAPI =="
curl -fsS "${BASE_URL}/openapi.json" | head -c 400 || true
echo
echo

echo "== Readiness report (requires repo scripts) =="
echo "API_BASE_URL=${BASE_URL} node scripts/demo-readiness-report.js --determinism --md"
