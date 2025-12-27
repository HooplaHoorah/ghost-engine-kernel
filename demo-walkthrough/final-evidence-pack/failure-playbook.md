# Failure Playbook (tiny + practical)

## A) Generate is slow / stalls
**Symptom:** Generate takes > 15–20s.
**Action:** Don’t wait on stage. Switch to backup:
- `https://d3a3b2mntnsxvl.cloudfront.net/play?job=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`

## B) Generate returns error / 5xx
**Symptom:** UI shows error, or alarm triggers.
**Action:**
1) Refresh once
2) If still failing, use backup job Play link
3) After stage: open CloudWatch dashboard and check ALB 5xx + orchestrator logs

## C) Play loads but LevelSpec fetch fails
**Symptom:** Blank / no map.
**Expected behavior:** Auto-fallback to proxy should handle this.
**Action:** Refresh once. If still failing, use backup job.

## D) UI button missing / misbehaving
**Action:** Use direct URLs:
- Demo: `https://d3a3b2mntnsxvl.cloudfront.net/demo?jobId=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`
- Play: `https://d3a3b2mntnsxvl.cloudfront.net/play?job=ed0f66d4-16cb-49ec-a05e-2d25e3d86a1f`

## E) “Everything is down”
**Action:** Show evidence pack (screenshots + links), explain architecture + determinism,
then offer live run at booth / follow-up.
