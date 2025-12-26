# QA Checklist (local + deployed)

## Local
- [ ] Generate a job in /demo
- [ ] Play (Browser) opens /play?job=<id>
- [ ] Play page loads LevelSpec and starts game
- [ ] Movement works, exit condition works
- [ ] Hash displays
- [ ] If Play is opened before job completes, page waits/polls status

## Deployed (ALB)
- [ ] Same flow works on ALB domain
- [ ] If presigned fetch is blocked (CORS), proxy endpoint works
- [ ] No 429 surprises in UI

## Regression
- [ ] Existing CLI Play command still works
- [ ] Replay still works
- [ ] Warmup still works
