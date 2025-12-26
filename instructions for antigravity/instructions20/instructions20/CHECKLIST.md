# Checklist — Definition of Done (Slice 15 / instructions20)

## /healthz preflight
- [ ] Demo Pack button calls /healthz first
- [ ] Aborts on non-200 or failed configured dep checks (ddb/s3)
- [ ] Shows clear error message and keeps UI usable

## Pack summary
- [ ] Final status shows saved N/3
- [ ] Failed preset labels are visible (status string or list)

## Persistent version
- [ ] pluginVersion is stored in localStorage on completion
- [ ] version stamp restores pluginVersion on refresh

