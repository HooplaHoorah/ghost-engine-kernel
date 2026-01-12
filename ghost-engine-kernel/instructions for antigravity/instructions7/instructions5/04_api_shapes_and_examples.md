# API shapes and examples

These are *recommended* shapes. Adjust field names to your existing API but keep the semantics.

---

## POST /generate-scene

Request:

```json
{
  "prompt": "A lava temple with 8 rooms and a boss arena",
  "plugin": "stub",
  "params": {
    "difficulty": "hard",
    "seed": 123,
    "size": "medium",
    "theme": "lava"
  }
}
```

Response:

```json
{
  "jobId": "191a729a-....",
  "state": "queued"
}
```

---

## GET /status/{jobId}

Slice 1 (embedded artifacts):

```json
{
  "jobId": "191a729a-....",
  "state": "done",
  "createdAt": "2025-12-25T21:00:00Z",
  "updatedAt": "2025-12-25T21:00:09Z",
  "plugin": "stub",
  "promptPreview": "A lava temple with 8 rooms ...",
  "steps": [
    { "name": "parse_prompt", "state": "done", "durationMs": 120, "summary": "Parsed 8 rooms, theme=lava" },
    { "name": "select_assets", "state": "done", "durationMs": 90, "summary": "Selected 2 enemy archetypes" },
    { "name": "compose_scene_graph", "state": "done", "durationMs": 250, "summary": "Built graph with 8 nodes, 9 edges" },
    { "name": "emit_level_stub", "state": "done", "durationMs": 40, "summary": "Emitted stub artifacts" }
  ],
  "result": {
    "sceneGraph": {
      "meta": { "seed": 123, "theme": "lava", "difficulty": "hard", "size": "medium" },
      "rooms": [
        { "id": "R1", "name": "Entry", "tags": ["start"], "connections": ["R2"] }
      ],
      "entities": [
        { "id": "E1", "type": "enemy", "roomId": "R4", "props": { "archetype": "imp" } }
      ],
      "items": [
        { "id": "I1", "type": "keycard", "roomId": "R3", "props": { "color": "red" } }
      ]
    },
    "asciiMinimap": "R1--R2\n |   |\nR3--R4\n"
  }
}
```

Slice 2 (S3 keys/URLs):

```json
{
  "jobId": "191a729a-....",
  "state": "done",
  "steps": [ /* same */ ],
  "result": {
    "sceneGraphS3Key": "jobs/191a729a/sceneGraph.json",
    "asciiMinimapS3Key": "jobs/191a729a/asciiMinimap.txt",
    "artifactUrl": "https://presigned-url..." 
  }
}
```

---

## GET /jobs

```json
[
  {
    "jobId": "191a729a-....",
    "state": "done",
    "createdAt": "2025-12-25T21:00:00Z",
    "updatedAt": "2025-12-25T21:00:09Z",
    "plugin": "stub",
    "promptPreview": "A lava temple with 8 rooms ...",
    "resultSummary": "8 rooms, 2 enemy types"
  }
]
```

---

## Error shape (recommended)

```json
{
  "error": {
    "code": "INVALID_PLUGIN",
    "message": "Plugin 'doom-wad' not installed. Valid: stub"
  }
}
```
