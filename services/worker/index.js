const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/', (_req, res) => res.status(200).send('<h1>Ghost Engine Worker</h1><p>OK</p>'));
app.get('/work', (_req, res) => res.status(200).json({ job: 'noop', status: 'done' }));

app.listen(PORT, () => console.log('worker on ' + PORT));
