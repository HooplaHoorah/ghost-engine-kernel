# 05 — Post-fix Smoke (copy/paste)

```bash
export API_BASE_URL="http://ghost-engine-alb-dev-2011300099.us-east-1.elb.amazonaws.com"

echo "== healthz =="
curl -sS "$API_BASE_URL/healthz" | head -c 2000; echo

echo "== generate-scene =="
GEN=$(curl -sS -X POST "$API_BASE_URL/generate-scene" -H "content-type: application/json" \
  -d '{"prompt":"doom-bridge: tiny test dungeon with a key and locked exit","plugin":"doom-bridge"}')
echo "$GEN"

JOB=$(python - <<'PY'
import json,sys
j=json.loads(sys.stdin.read())
print(j.get("jobId") or j.get("id") or "")
PY
<<<"$GEN")
echo "jobId=$JOB"

echo "== status =="
curl -sS "$API_BASE_URL/status/$JOB" | head -c 2000; echo

echo "== artifact proxy =="
curl -sS "$API_BASE_URL/artifact/$JOB/levelSpec" | head -c 2000; echo

echo "Share:"
echo "$API_BASE_URL/demo?jobId=$JOB"
echo "$API_BASE_URL/play?job=$JOB"
```
