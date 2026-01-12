#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${API_BASE_URL:-http://localhost:8080}"

echo "== Preflight: ${BASE_URL} =="
echo ""
echo "-- /healthz"
curl -s "${BASE_URL}/healthz" || true
echo ""
echo ""
echo "-- /openapi.json (first 60 lines)"
curl -s "${BASE_URL}/openapi.json" | sed -n '1,60p' || true
echo ""
echo ""
echo "TIP: if scripts/demo-readiness-report.js exists, run:"
echo "  API_BASE_URL=${BASE_URL} node scripts/demo-readiness-report.js --determinism --md"
