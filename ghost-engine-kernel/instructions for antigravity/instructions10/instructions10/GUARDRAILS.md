# Guardrails (Public Demo Safety)

## Why
Demos can get hammered. Guardrails prevent runaway cost and keep responsiveness.

## A) Rate limiting on /generate-scene
Implement IP-based limiter:
- e.g., 10 requests / 5 minutes per IP
- return 429 with friendly JSON
- consider `X-Forwarded-For` behind ALB

## B) Concurrency cap
Enforce a max number of running jobs per env:
- env var `RUNNING_JOBS_MAX`
- if exceeded, return 503/429 with retry-after
Implementation idea:
- DynamoDB query by status=running (via GSI)

## C) Payload limits + validation
- max prompt length
- seed integer validation
- whitelist plugin names
- sanitize text that could end up in logs/UI

## D) Timeouts
- worker step timeouts (fail job cleanly)

## E) CORS (if demo hosted separately)
- allow CORS from demo origin only

## Acceptance criteria
- abusive request patterns return 429/503 without cascading failures
- (optional) log/metric for rate limit events
