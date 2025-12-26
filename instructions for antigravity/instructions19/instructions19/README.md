# Ghost Engine — instructions19
## Slice 14: “Generate Demo Pack” Button (Client-Side) + Prettify-on-Paste + Version Stamp

Slice 13 delivered the Backup Panel paste/save UI.
Slice 14 takes it to “judge-proof, zero-terminal”:

### Outcomes
1) **Generate Demo Pack** button in `/demo`:
   - client-side generates 3 jobs (fixed seeds/presets)
   - polls to done
   - stores `{createdAt, items}` into localStorage `ghost:demoPack`
   - re-renders Backup Links automatically
2) **Prettify-on-paste** for the backup JSON textarea:
   - parse + pretty-print on paste/blur (no save required)
   - friendly errors
3) **Version stamp** in UI:
   - show API base URL and pluginVersion (from latest job) and optional commit SHA if available

### Contents
- `SLICE14_PLAN.md`
- `GENERATE_DEMO_PACK_BUTTON.md`
- `PRETTIFY_ON_PASTE.md`
- `VERSION_STAMP.md`
- `CHECKLIST.md`
- `templates/` (HTML + JS snippets)

