#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/judge-demo.sh <prompt|prompt_file> [--route <relative_path>] [--project <project_id>] [--location <gcp_region>]

Demonstrates how to invoke the Ghost Engine Judge API. Provide either a literal
prompt string or the path to a file containing the prompt as the first
argument.

Environment variables:
  JUDGE_API_ROOT   Required. Base URL for the Judge service (e.g. https://example.run.app).
  JUDGE_ROUTE      Optional. Overrides the default relative route /v1/judge:predict.
  GOOGLE_CLOUD_PROJECT Optional. Default project if --project flag omitted.

The script prints the JSON response from the Judge API. The request is
authenticated with an access token from `gcloud auth print-access-token`.
USAGE
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "Error: gcloud CLI is required." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required." >&2
  exit 1
fi

API_ROOT=${JUDGE_API_ROOT:-}
if [[ -z "${API_ROOT}" ]]; then
  echo "Error: Set JUDGE_API_ROOT to the base URL for the Judge service." >&2
  exit 1
fi

ROUTE="${JUDGE_ROUTE:-/v1/judge:predict}"
PROJECT="${GOOGLE_CLOUD_PROJECT:-}"
LOCATION="us-central1"
PROMPT_ARG=$1
shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --route)
      ROUTE=$2
      shift 2
      ;;
    --project)
      PROJECT=$2
      shift 2
      ;;
    --location)
      LOCATION=$2
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${PROJECT}" ]]; then
  echo "Error: Set GOOGLE_CLOUD_PROJECT or provide --project." >&2
  exit 1
fi

if [[ -f "${PROMPT_ARG}" ]]; then
  PROMPT_JSON=$(python3 - <<'PY' "${PROMPT_ARG}"
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
print(json.dumps(path.read_text()))
PY
)
else
  PROMPT_JSON=$(python3 - <<'PY' "${PROMPT_ARG}"
import json, sys
print(json.dumps(sys.argv[1]))
PY
)
fi

ACCESS_TOKEN=$(gcloud auth print-access-token)

REQUEST_BODY=$(cat <<JSON
{
  "project": "${PROJECT}",
  "location": "${LOCATION}",
  "prompt": ${PROMPT_JSON}
}
JSON
)

curl -sS \
  "${API_ROOT%/}${ROUTE}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${REQUEST_BODY}"
