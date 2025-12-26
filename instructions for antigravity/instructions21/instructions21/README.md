# Ghost Engine — instructions21
## Slice 16: Panic Button — “Open Newest Backup” (Instant Recovery)

Slice 15 hardened Demo Pack generation and persistence.
Slice 16 adds a “panic button” for live demos:

### Outcomes
- `/demo` UI includes an **Open newest backup** button.
- If a demo pack exists in localStorage (`ghost:demoPack`), clicking the button loads the newest/first backup job immediately.
- Button is hidden/disabled if no backups exist.
- Optional: also include “Open random backup” for variety (still deterministic in content because jobIds are pre-baked).

### Contents
- `SLICE16_PLAN.md`
- `OPEN_NEWEST_BACKUP.md`
- `CHECKLIST.md`
- `templates/` (HTML + JS)

