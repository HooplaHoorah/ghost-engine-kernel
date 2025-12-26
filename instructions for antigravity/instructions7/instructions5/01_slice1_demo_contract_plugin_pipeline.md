# Slice 1 — Demo contract + plugin step registry + “wow” artifact

Goal: make Ghost Engine feel like an *engine* in <30 seconds:
- An external user can call the API, watch a job move through steps, and get a tangible output.

---

## A) API changes (Orchestrator)

### 1) Add `GET /jobs`

**Purpose:** list the latest jobs for demos and debugging.

**Response shape:** see `04_api_shapes_and_examples.md`.

**Implementation options (pick one):**
- **Option A (fastest):** in-memory ring buffer (size ~200), return most recent 20.
- **Option B (if you already have a store):** query your existing store.

**Sorting:** newest first.

**Fields:** `jobId`, `state`, `createdAt`, `updatedAt`, `plugin`, `promptPreview`, optional `error`, and optional `resultSummary`.

### 2) Add OpenAPI docs

Pick one:
- `GET /openapi.json` + `/docs` (Swagger UI), or
- `GET /openapi.yaml`, or
- framework-native docs (FastAPI auto docs etc.)

**Minimum documented endpoints:**
- `POST /generate-scene`
- `GET /status/{jobId}`
- `GET /jobs`

**Tip:** keep the OpenAPI source-of-truth inside the repo (checked in), not generated at deploy time.

---

## B) Worker pipeline: step registry

### 1) Formal step list

Implement a pipeline with *exact step IDs*:

1. `parse_prompt`
2. `select_assets`
3. `compose_scene_graph`
4. `emit_level_stub`

Each step should report:
- `name` (one of the above IDs)
- `state`: `pending | running | done | failed | skipped`
- `startedAt`, `endedAt`, `durationMs`
- `summary` (short string)

### 2) How to report steps

Update job status after each step:
- Mark step `running` with `startedAt`
- On completion, mark `done` with `endedAt`, `durationMs`, `summary`
- On exception, mark `failed`, set job `state=failed`, attach error message/stack (sanitized)

If you already have structured logging + trace IDs, include:
- `jobId`, `traceId`, `stepName`, `stepState`, `durationMs`

---

## C) Plugin interface + default `stub` plugin

### 1) Plugin selection

- Default plugin from env: `ENGINE_PLUGIN=stub`
- Allow request override: `POST /generate-scene` can accept `plugin` (optional).
- If request specifies plugin not available, fail fast with `400` and list valid plugins.

### 2) Minimal plugin interface (language-agnostic)

A plugin should implement:

- `name() -> string`
- `emit(sceneGraph, context) -> { artifact(s) }`

Where `sceneGraph` is the normalized intermediate representation produced by step 3.

### 3) Default output: “wow” artifact

The **stub plugin** should output:

- `sceneGraph` (JSON object)
- `asciiMinimap` (multi-line string)

Return in `GET /status/{jobId}` under:

```json
{
  "result": {
    "sceneGraph": { ... },
    "asciiMinimap": "....\n....\n"
  }
}
```

---

## D) SceneGraph: minimal spec

Keep it small but expressive:

- `meta`: `{ seed, theme, difficulty, size }`
- `rooms[]`: `{ id, name, tags[], bounds?, connections[] }`
- `entities[]`: `{ id, type, roomId, position?, props? }`
- `items[]`: `{ id, type, roomId, props? }`

The goal is not realism; it’s *demo-ability*.

---

## E) Orchestrator/Worker handoff (queue message)

Queue payload should include:
- `jobId`
- `prompt`
- `plugin` (resolved selection)
- `params` (optional: difficulty, seed, style)

---

## F) Edge cases

- Missing/empty prompt -> `400`
- Worker crash -> Orchestrator status eventually shows `failed` or `stale` (optional)
- Long prompts -> store only a `promptPreview` (e.g., first 120 chars) in listings

---

## Deliverables (Slice 1)

- [ ] `GET /jobs`
- [ ] OpenAPI docs endpoint
- [ ] Worker step registry with step timings
- [ ] Plugin interface + `stub` plugin
- [ ] `sceneGraph` + `asciiMinimap` in status response
