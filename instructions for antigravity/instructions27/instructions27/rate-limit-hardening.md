# 429 Rate-limit Hardening (Stage Safety)

Occasional 429s are good (protection), but the UX must prevent accidental spamming
and make recovery obvious.

## A) UI hardening (preferred, fastest ROI)
### 1) Disable buttons while in-flight
- Disable Generate/Replay immediately on click
- Re-enable only when job completes/fails

### 2) Debounce rapid clicks
- Add a short debounce (300–800ms) on click handlers

### 3) Backoff on 429
- If API returns 429:
  - Read `Retry-After` header (if present)
  - Show message: “Rate limited — try again in Xs”
  - Auto re-enable the button after that delay

## B) Backend friendliness
### 1) Return helpful JSON for 429
Example:
```json
{
  "error": "rate_limited",
  "message": "Too many requests. Please retry shortly.",
  "retryAfterSeconds": 3
}
```

### 2) Add `Retry-After`
- `Retry-After: <seconds>` header is ideal for clients.

## Acceptance
- Clicking Generate/Replay rapidly does NOT spam the API
- If 429 occurs, UI explains it clearly and recovers automatically
