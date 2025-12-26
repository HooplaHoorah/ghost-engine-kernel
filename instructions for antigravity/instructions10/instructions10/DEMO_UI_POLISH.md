# Demo UI Polish

## Goals
Make `/demo` stage-ready and frictionless.

## Changes
### 1) Preset prompts dropdown
Add a select with 5–8 curated prompts:
- “Three-room key door”
- “Arena with two exits”
- “Looping corridor + ambush”
- “Boss room with health pack”

### 2) Share link by jobId
Support loading a job by URL param:
- `/demo?jobId=<id>`
Behavior:
- auto-fetch status and render artifacts
- no new job needed

### 3) Copy/download buttons
Add buttons:
- Copy sceneGraph JSON
- Copy levelSpec JSON
- Download levelSpec (inline blob or open presigned URL)

### 4) Seed + pluginVersion display
Always show:
- seed
- plugin
- pluginVersion
- createdAt

### 5) Error display
If status failed:
- show error message prominently
- include “Try again” button

## Acceptance criteria
- A presenter can open one link and show a finished job
- A judge can copy LevelSpec and run it in GE Doom without digging in devtools
