const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8080;
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8081';

app.use(express.json());

// 1. Health check
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.status(200).send('<h1>Ghost Engine Orchestrator</h1>'));

// In-memory stub state
const jobs = {};

// 2. Generate Scene (trigger)
app.post('/generate-scene', async (req, res) => {
  // Stub: receive prompt, return job ID
  const { prompt, style } = req.body;
  if (!prompt) return res.status(400).json({ error: 'missing prompt' });

  const jobId = crypto.randomUUID();
  jobs[jobId] = {
    id: jobId,
    status: 'pending',
    prompt,
    created_at: new Date().toISOString()
  };

  console.log(`[Job ${jobId}] Created scene generation request`);

  // Dispatch to Worker
  try {
    console.log(`[Job ${jobId}] Dispatching to ${WORKER_URL}/process`);
    fetch(`${WORKER_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId, prompt })
    }).catch(err => console.error(`[Job ${jobId}] Async worker dispatch failed:`, err));
  } catch (e) {
    console.error(`[Job ${jobId}] Setup failed:`, e);
  }

  res.status(202).json({ job_id: jobId, status: 'pending' });
});

// 3. Status check
app.get('/status/:id', (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: 'job not found' });
  res.json(job);
});

app.listen(PORT, () => console.log('orchestrator running on port ' + PORT));
