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
  const { prompt, style, seed } = req.body;
  if (!prompt) return res.status(400).json({ error: 'missing prompt' });

  const jobId = crypto.randomUUID();
  jobs[jobId] = {
    jobId,
    state: 'queued',
    progress: 0,
    result: null,
    error: null,
    createdAt: new Date().toISOString()
  };

  console.log(`[Job ${jobId}] Created scene generation request`);

  // Dispatch to Worker (background)
  // We don't await this for the client response
  (async () => {
    try {
      jobs[jobId].state = 'running';
      console.log(`[Job ${jobId}] Dispatching to ${WORKER_URL}/process`);

      const workerRes = await fetch(`${WORKER_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, prompt, style, seed })
      });

      if (!workerRes.ok) {
        throw new Error(`Worker responded with ${workerRes.status}`);
      }

      const data = await workerRes.json();
      // Expecting { jobId, ok: true, output: {...} }

      jobs[jobId].state = 'done';
      jobs[jobId].progress = 1.0;
      jobs[jobId].result = data.output;
      console.log(`[Job ${jobId}] Completed successfully`);
    } catch (err) {
      console.error(`[Job ${jobId}] Failed:`, err);
      jobs[jobId].state = 'failed';
      jobs[jobId].error = err.message;
    }
  })();

  res.status(202).json({
    jobId,
    statusUrl: `/status/${jobId}`
  });
});

// 3. Status check
app.get('/status/:id', (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: 'job not found' });
  res.json(job);
});

app.listen(PORT, () => console.log('orchestrator running on port ' + PORT));
