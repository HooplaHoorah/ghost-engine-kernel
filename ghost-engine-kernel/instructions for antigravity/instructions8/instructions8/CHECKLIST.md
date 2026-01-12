# Checklist — Definition of Done (Slice 3)

## Artifacts UX
- [ ] In persistent mode, `GET /status/:id` returns `sceneGraphUrl` and `asciiMinimapUrl` (presigned)
- [ ] URLs work and expire (15–60 min)
- [ ] Demo mode still returns inline artifacts

## Security
- [ ] `/internal/jobs/:id/step` requires `X-INTERNAL-TOKEN`
- [ ] Token stored in SSM (SecureString) and injected to both services
- [ ] Worker includes token header on callbacks
- [ ] (Optional) SG rules restrict internal callback traffic

## DynamoDB safety
- [ ] Steps appended atomically (no overwrites)
- [ ] Duplicate callbacks do not duplicate steps (idempotent via stepIds)
- [ ] Status cannot regress; terminal states are enforced
- [ ] Errors recorded in a consistent shape

## Retention
- [ ] DynamoDB TTL enabled and `ttl` written
- [ ] S3 lifecycle expires artifacts after N days

## CI
- [ ] Post-deploy smoke test hits live ALB and validates:
      - /openapi.json
      - /generate-scene → /status/:id done
      - steps present
      - artifacts present (inline or URLs)
      - /jobs contains job
- [ ] CI fails on regression

## Observability
- [ ] Job duration and per-step duration emitted (metrics or log-derived)
- [ ] Error count metric emitted
- [ ] CloudWatch dashboard updated with at least 2–4 widgets for these signals
