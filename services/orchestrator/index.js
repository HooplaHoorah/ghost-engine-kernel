const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// health for GET and HEAD
app.get('/health', (_req, res) => res.type('text/plain').send('ok'));
app.head('/health', (_req, res) => res.sendStatus(200));

// simple root
app.get('/', (_req, res) => res.type('text/plain').send('Ghost Engine Orchestrator is running'));

app.listen(port, '0.0.0.0', () => console.log(`orchestrator listening on ${port}`));
