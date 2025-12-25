const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8080;
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8081';

// AWS DynamoDB
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.JOBS_TABLE_NAME;

// Structured Logging Helper
const log = (msg, context = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: msg,
    ...context
  }));
};

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
  const jobState = {
    jobId,
    state: 'queued',
    progress: 0,
    result: null,
    error: null,
    createdAt: new Date().toISOString()
  };

  // Persist Initial State
  try {
    if (TABLE_NAME) {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: jobState
      }));
    } else {
      jobs[jobId] = jobState;
    }
    log(`Created scene generation request`, { traceId: jobId, persistence: !!TABLE_NAME });
  } catch (e) {
    console.error(`[Job ${jobId}] Setup failed (DDB error):`, e);
    return res.status(500).json({ error: 'internal error' });
  }

  // Dispatch to Worker (background)
  (async () => {
    try {
      // SET RUNNING
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId },
          UpdateExpression: "set #s = :s",
          ExpressionAttributeNames: { "#s": "state" },
          ExpressionAttributeValues: { ":s": "running" }
        }));
      } else if (jobs[jobId]) jobs[jobId].state = 'running';

      log(`Dispatching to Worker`, { traceId: jobId, target: `${WORKER_URL}/process` });
      const workerRes = await fetch(`${WORKER_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, prompt, style, seed })
      });

      if (!workerRes.ok) throw new Error(`Worker responded with ${workerRes.status}`);
      const data = await workerRes.json();

      // SET DONE & RESULT
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId },
          UpdateExpression: "set #s = :s, progress = :p, #r = :r",
          ExpressionAttributeNames: { "#s": "state", "#r": "result" },
          ExpressionAttributeValues: { ":s": "done", ":p": 1.0, ":r": data.output }
        }));
      } else if (jobs[jobId]) {
        jobs[jobId].state = 'done';
        jobs[jobId].progress = 1.0;
        jobs[jobId].result = data.output;
      }
      log(`Completed successfully`, { traceId: jobId });

    } catch (err) {
      console.error(`[Job ${jobId}] Failed:`, err);
      // SET FAILED
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId },
          UpdateExpression: "set #s = :s, #e = :e",
          ExpressionAttributeNames: { "#s": "state", "#e": "error" },
          ExpressionAttributeValues: { ":s": "failed", ":e": err.message }
        })).catch(e => console.error("Failed to update failure state", e));
      } else if (jobs[jobId]) {
        jobs[jobId].state = 'failed';
        jobs[jobId].error = err.message;
      }
    }
  })();

  res.status(202).json({ jobId, statusUrl: `/status/${jobId}` });
});

// 3. Status check
// 3. Status check
app.get('/status/:id', async (req, res) => {
  const jobId = req.params.id;

  if (TABLE_NAME) {
    try {
      const { Item } = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { jobId }
      }));
      if (!Item) return res.status(404).json({ error: 'job not found' });
      return res.json(Item);
    } catch (e) {
      console.error("DDB Read Error:", e);
      return res.status(500).json({ error: 'storage error' });
    }
  } else {
    const job = jobs[jobId];
    if (!job) return res.status(404).json({ error: 'job not found' });
    res.json(job);
  }
});

app.listen(PORT, () => console.log('orchestrator running on port ' + PORT));
