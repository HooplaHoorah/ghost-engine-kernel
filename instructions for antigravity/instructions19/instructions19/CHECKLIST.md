# Checklist — Definition of Done (Slice 14 / instructions19)

## Generate Demo Pack button
- [ ] Button present in /demo UI
- [ ] Generates 3 jobs sequentially with fixed seeds
- [ ] Polls to done and saves pack to localStorage `ghost:demoPack`
- [ ] Backup Links panel updates automatically
- [ ] UI shows progress + success/warning messages
- [ ] Controls disabled while running; re-enabled afterward

## Prettify-on-paste
- [ ] Textarea auto-prettifies valid JSON on paste/blur
- [ ] Invalid JSON shows friendly status without crashing
- [ ] Does not auto-save (Save button remains explicit)

## Version stamp
- [ ] Shows API origin
- [ ] Shows pluginVersion from last completed job (when available)
- [ ] Optionally shows build SHA if present

