const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// basic health endpoint for Cloud Run
app.get('/health', (req, res) => res.status(200).send('ok'));

// serve static landing if present
const pub = path.join(__dirname, 'public');
app.use(express.static(pub));

app.get('/', (req, res) => {
  const index = path.join(pub, 'index.html');
  res.sendFile(index, err => {
    if (err) res.status(200).send('Ghost Engine Orchestrator is running');
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`orchestrator listening on ${port}`);
});
