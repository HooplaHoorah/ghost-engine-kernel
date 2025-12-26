# instructions4.md — Antigravity quick checks to fix ECS “CannotPullContainerError :latest not found”

## What’s happening (context)
ECS is stopping the **orchestrator** task with:

> CannotPullContainerError … failed to resolve ref `.../ghost-engine-orchestrator-dev:latest`: **not found**

This means the ECS task definition points to the `:latest` tag, but the ECR repo either:
- has **no images**, or
- has images but **no `latest` tag**, or
- images were pushed to a **different repo/region/account**, or
- GitHub Actions build/push **failed** (or never ran with the right role).

Your job: collect the exact facts below so ChatGPT can prescribe the right single fix.

**Do not modify anything** unless explicitly instructed. This is read-only reconnaissance.

---

## 1) ECR — do images exist and what tags?
In AWS Console (region **us-east-1**):

### A) Orchestrator repo
1. Go to **ECR → Repositories**
2. Click repo: **`ghost-engine-orchestrator-dev`**
3. Open **Images** tab
4. Report:
   - Is there any image present? (Y/N)
   - List the **Image tags** shown (especially whether `latest` exists)
   - List one **Image digest** (first 8 chars is fine) and **Pushed at** timestamp

### B) Worker repo
Repeat for repo: **`ghost-engine-worker-dev`**
Report the same info.

✅ If you can, copy/paste the “Image URI / tag” format visible in the UI.

---

## 2) ECS task definition — confirm what image tag it expects
In AWS Console (us-east-1):

1. Go to **ECS → Task definitions**
2. Click family: **`ghost-engine-orchestrator-dev`**
3. Open the latest revision (likely `:1`)
4. In **Container definitions**, click **orchestrator**
5. Report:
   - **Image URI** exactly (includes tag)
   - Container port mapping(s) (e.g., 8080)
   - Any env vars set (especially `PORT`, `WORKER_URL`)

Repeat for **`ghost-engine-worker-dev`** and report the **Image URI** it expects.

---

## 3) ECS service events — the newest failure line
In AWS Console (us-east-1):

1. ECS → Clusters → `ghost-engine-cluster-dev`
2. Services → `orchestrator`
3. Open **Events** tab
4. Copy/paste the **most recent 3 event lines** (the latest errors)

Repeat for service **`worker`** (if it exists) and copy/paste the most recent 3 event lines.

---

## 4) GitHub Actions — did build-and-push succeed and what tags did it push?
In GitHub repo **HooplaHoorah/ghost-engine-kernel**:

1. Go to **Actions**
2. Open workflow: **Build and Push**
3. Open the latest run
4. Report:
   - Status: Success/Fail/In progress
   - The **commit SHA** it ran on
   - In logs: locate the **docker build** and **docker push** lines
     - What ECR repo did it push to?
     - What tags did it push? (`latest`, SHA, etc.)

If the run failed:
- Copy/paste the **first error block** (10–20 lines around the failure).

---

## 5) GitHub Secrets/Variables — confirm role + region exist
In GitHub repo settings:

Settings → **Secrets and variables → Actions**

Report (do NOT reveal secret values, just presence):
- Secret present? `AWS_ROLE_ARN` (Y/N)
- Variable present? `AWS_REGION` (Y/N) and value if it’s not secret (should be `us-east-1`)

---

## 6) Output template — paste back like this
Fill in and paste back to ChatGPT:

### ECR (us-east-1)
- orchestrator repo images present: Y/N
- orchestrator tags found: ...
- orchestrator pushed-at + digest sample: ...
- worker repo images present: Y/N
- worker tags found: ...
- worker pushed-at + digest sample: ...

### ECS task definitions
- orchestrator image URI expected: ...
- orchestrator port mappings: ...
- orchestrator env vars (names only): ...
- worker image URI expected: ...
- worker port mappings: ...
- worker env vars (names only): ...

### ECS service events (latest 3 lines)
- orchestrator events:
  1) ...
  2) ...
  3) ...
- worker events:
  1) ...
  2) ...
  3) ...

### GitHub Actions (Build and Push)
- latest run status: ...
- ran on SHA: ...
- pushed repos: ...
- pushed tags: ...
- if failed: error snippet: ...

### GitHub settings
- AWS_ROLE_ARN secret present: Y/N
- AWS_REGION present: Y/N (value: ...)

---

## What fixes are likely (don’t do yet — just FYI)
Depending on what you find, the fix will be one of:
- push a `latest` tag to ECR (adjust workflow to tag `latest`), OR
- update ECS task definition to use the actual pushed tag (SHA), OR
- fix OIDC role/permissions so GitHub Actions can push, OR
- ensure workflow pushes to the correct account/region/repo.

Once you return the template, ChatGPT will give the exact single change to get targets healthy and remove the 503.
