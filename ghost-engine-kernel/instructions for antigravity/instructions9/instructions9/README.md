# Ghost Engine — instructions9
## Slice 4: CI Gate + Demo UI + Observability + GE Doom Bridge Plugin

This bundle is the next slice after instructions8 (Slice 3: Hardening + Demo Ergonomics).

### Outcomes
1) **CI/CD is self-policing**: after every deploy, a live **smoke test** runs against the deployed ALB and fails the pipeline on regression.
2) **One-click demo**: a tiny **web demo page** lets anyone generate a scene, watch steps, view the ASCII minimap, and download artifacts.
3) **Ops visibility**: job + step durations and failures emit metrics, dashboard widgets/alarms exist, and you can troubleshoot quickly.
4) **CodeLaunch bridge**: a new plugin produces a **GE Doom-friendly “LevelSpec”** artifact deterministically from `sceneGraph` + `seed`.

### Contents
- `SLICE4_PLAN.md` — requirements + acceptance criteria
- `CI_GATE.md` — workflow wiring + deployment URL handling
- `DEMO_UI.md` — minimal web demo implementation (with sample files under `demo/`)
- `OBSERVABILITY.md` — metrics + dashboard/alarms guidance
- `DOOM_BRIDGE_PLUGIN.md` — new plugin spec + LevelSpec schema + deterministic seed plan
- `CHECKLIST.md` — definition of done

Sample assets:
- `demo/index.html`
- `demo/demo.js`
- `demo/styles.css`
