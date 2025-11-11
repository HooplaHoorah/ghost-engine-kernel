const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const WORKER_URL = process.env.WORKER_URL || 'https://worker-zpwl4fwxg-uc.a.run.app';

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.status(200).send('<h1>Ghost Engine Orchestrator</h1><p>OK</p>'));

app.get('/call-worker', async (_req, res) => {
  try {
    const r = await fetch(WORKER_URL + '/work');
    const type = r.headers.get('content-type') || '';
    const data = type.includes('application/json') ? await r.json() : await r.text();
    res.status(200).json({ orchestrator: 'ok', worker_url: WORKER_URL, worker_response: data });
  } catch (e) {
    res.status(502).json({ error: 'worker-unreachable', detail: String(e) });
  }
});

app.listen(PORT, () => console.log('orchestrator on ' + PORT));
