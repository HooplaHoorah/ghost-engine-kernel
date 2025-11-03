import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.get('/health', (_req, res) => {
  res.status(200).send('ok');
});

app.get('/', (_req, res) => {
  res.status(200).json({ service: 'ghost-orchestrator', status: 'ready' });
});

// Cloud Run requires binding to 0.0.0.0:$PORT
app.listen(port, '0.0.0.0', () => {
  console.log(`orchestrator listening on ${port}`);
});
