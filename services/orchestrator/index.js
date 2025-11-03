import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// Standard health endpoint used by CI and uptime checks
app.get('/health', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/', (req, res) => {
  res.json({ service: 'ghost-orchestrator', status: 'ready' });
});

app.listen(port, () => {
  console.log(`orchestrator listening on ${port}`);
});
