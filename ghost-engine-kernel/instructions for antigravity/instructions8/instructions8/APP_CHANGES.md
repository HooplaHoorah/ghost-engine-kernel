# Application Changes (Orchestrator + Worker)

> Adjust snippets to match your framework (Express/Fastify/etc.) and your existing AWS SDK usage.

## A) Presigned URLs in Orchestrator

### Why Orchestrator?
Orchestrator owns the public API response. Generating presigned URLs here keeps Worker simple and allows:
- consistent expiration policy
- centralized auth/logging
- optional future “streaming proxy” endpoints

### Node (AWS SDK v3) deps (Orchestrator)
Add:
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`

### Presign helper (TypeScript)
```ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});

export async function presignGet(bucket: string, key: string, expiresInSec = 900) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSec });
}
```

### Status response shaping
If job item contains keys:
- `result.sceneGraphKey`
- `result.asciiMinimapKey`

Then in `GET /status/:id`:
- add `result.sceneGraphUrl = await presignGet(bucket, key)`
- add `result.asciiMinimapUrl = await presignGet(bucket, key)`

**Fallback**: if `ARTIFACTS_BUCKET` missing, keep demo-mode inline payload.

### Optional: artifact endpoint
Instead of embedding URLs, you can add:
- `GET /jobs/:id/artifacts/:name`
which returns a 302 redirect to a presigned URL, or streams the object.

---

## B) Secure `/internal/jobs/:id/step`

### Orchestrator
- Add env var: `INTERNAL_TOKEN`
- Require request header `X-INTERNAL-TOKEN` to match.

```ts
export function requireInternalToken(req, res, next) {
  const expected = process.env.INTERNAL_TOKEN;
  const token = req.header("X-INTERNAL-TOKEN");
  if (!expected || token !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  return next();
}
```

Apply middleware to internal routes only.

### Worker
When POSTing step updates, include:
- `X-INTERNAL-TOKEN: process.env.INTERNAL_TOKEN`

---

## C) Idempotent + race-safe DynamoDB updates

### Recommended callback payload (Worker → Orchestrator)
Prefer sending **1 completed event per step** (simplifies idempotency). Include:
- `stepId`: deterministic unique id (e.g., `${jobId}:${stepName}`)
- `name`: step name
- `startedAt`, `endedAt`, `durationMs`
- `summary`: short string
- `status`: `ok|error`

Example JSON:
```json
{
  "stepId": "191a729a:compose_scene_graph",
  "name": "compose_scene_graph",
  "startedAt": "2025-12-25T12:00:00.000Z",
  "endedAt": "2025-12-25T12:00:00.300Z",
  "durationMs": 300,
  "summary": "Composed 12 rooms, 18 doors, 6 enemies",
  "status": "ok"
}
```

### DynamoDB update strategy (Orchestrator)
Store:
- `steps`: List<Map>
- `stepIds`: String Set
- `status`: string
- `updatedAt`

Use an atomic update:
- `ADD stepIds :sidSet`
- `SET steps = list_append(if_not_exists(steps, :emptyList), :newStep), updatedAt=:now`
- `ConditionExpression`: `attribute_not_exists(stepIds) OR NOT contains(stepIds, :sid)`

Also add a terminal guard:
- reject any updates if `status IN (done, failed)`

Pseudo-condition:
```txt
(#status <> :done AND #status <> :failed) AND
(attribute_not_exists(stepIds) OR NOT contains(stepIds, :sid))
```

### Status transitions
Enforce:
- queued → running → done/failed
Terminal states should never be overwritten.

Implementation approaches:
- Set `running` when first step arrives (conditional: only if queued/missing)
- Set terminal status only if current in (queued, running)

---

## D) Large payload policy (optional)
If you want best DX:
- if sceneGraph JSON < N KB, return inline
- else offload to S3 + return keys/URLs

---

## E) Errors
Ensure errors are stored consistently:
- `status = failed`
- `error` object: `{ message, code?, details? }`
- preserve steps completed so far
