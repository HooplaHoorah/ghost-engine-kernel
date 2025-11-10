const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/health', (_req, res) => res.type('text/plain').send('ok'));
app.head('/health', (_req, res) => res.sendStatus(200));

app.get('/', (_req, res) => res.type('text/plain').send('Ghost Engine Worker is running'));

app.listen(port, '0.0.0.0', () => console.log(`worker listening on ${port}`));
