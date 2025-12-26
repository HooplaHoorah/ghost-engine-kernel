# Artifact verification summary counts

## Goal
Make it easy to see at a glance whether artifact URLs are healthy.

## Counting
Each URL field validated counts as 1 attempted check:
- JSON: levelSpecUrl, sceneGraphUrl
- text: asciiMinimapUrl, levelPreviewAsciiUrl

Increment passed if validation succeeds.

## Output
After validations in each section print:
- `Artifacts verified: <passed>/<attempted> OK`

If attempted is 0 (no urls present), print:
- `Artifacts verified: 0/0 (no presigned urls present)`

