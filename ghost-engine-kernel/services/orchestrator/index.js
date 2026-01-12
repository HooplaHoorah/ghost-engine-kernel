const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit'); // Add rate limit
const app = express();
app.set('trust proxy', 1); // Trust ALB
const PORT = process.env.PORT || 8080;
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8081';

// Guardrails
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/generate-scene', limiter); // Apply to generation only? Or global? Instructions say "Rate limiting on /generate-scene"

// Concurrency Cap
const RUNNING_JOBS_MAX = parseInt(process.env.RUNNING_JOBS_MAX || '5', 10);

const checkConcurrency = async (req, res, next) => {
  if (!TABLE_NAME) return next(); // In-memory doesn't enforce strict global cap currently or uses simpler logic

  try {
    // Poor man's concurrency check: Get latest 50 jobs and count running. 
    // Real prod equivalent would typically use a dedicated GSI or counter item.
    const { Items } = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :pk',
      ExpressionAttributeValues: { ':pk': 'JOB' },
      ScanIndexForward: false,
      Limit: 50 // Check last 50
    }));

    const running = (Items || []).filter(j => j.state === 'running').length;
    if (running >= RUNNING_JOBS_MAX) {
      return res.status(503).json({ error: 'Too many running jobs, please try again later.' });
    }
    next();
  } catch (e) {
    console.error("Concurrency check failed", e);
    next(); // Fail open
  }
};

// AWS DynamoDB
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true
  }
});
const TABLE_NAME = process.env.JOBS_TABLE_NAME;

// AWS S3 (Presigning)
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const ARTIFACTS_BUCKET = process.env.ARTIFACTS_BUCKET;

const presignGet = async (key) => {
  if (!ARTIFACTS_BUCKET || !key) return null;
  try {
    const command = new GetObjectCommand({ Bucket: ARTIFACTS_BUCKET, Key: key });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (e) {
    console.error("Presign failed", e);
    return null;
  }
};

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;
const requireInternalToken = (req, res, next) => {
  // If no token configured, skip check (dev mode) or fail open? 
  // Secure mode: if env set, require header.
  if (INTERNAL_TOKEN) {
    const token = req.header("X-INTERNAL-TOKEN");
    if (token !== INTERNAL_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }
  next();
};

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
app.get('/healthz', async (_req, res) => {
  const now = new Date().toISOString();
  const configured = {
    JOBS_TABLE_NAME: !!process.env.JOBS_TABLE_NAME,
    ARTIFACTS_BUCKET: !!process.env.ARTIFACTS_BUCKET,
    INTERNAL_TOKEN: !!process.env.INTERNAL_TOKEN,
  };

  // Optional health checks (best‑effort, non‑blocking)
  let ddbOk = null;
  let s3Ok = null;
  if (TABLE_NAME) {
    try {
      const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
      const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
      await ddb.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
      ddbOk = true;
    } catch (e) {
      ddbOk = false;
    }
  }
  if (ARTIFACTS_BUCKET) {
    try {
      const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');
      const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
      await s3.send(new HeadBucketCommand({ Bucket: ARTIFACTS_BUCKET }));
      s3Ok = true;
    } catch (e) {
      s3Ok = false;
    }
  }

  res.status(200).json({
    ok: true,
    time: now,
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    configured,
    checks: { ddb: ddbOk, s3: s3Ok },
  });
});
app.get('/', (_req, res) => res.status(200).send('<h1>Ghost Engine Orchestrator</h1>'));

// In-memory stub state
const jobs = {};
const jobHistory = [];
const MAX_HISTORY = 20;

const addToHistory = (job) => {
  jobHistory.unshift(job);
  if (jobHistory.length > MAX_HISTORY) jobHistory.pop();
};

// 2. Generate Scene
app.post('/generate-scene', checkConcurrency, async (req, res) => {
  let { prompt, style, seed, plugin, params } = req.body;

  // Guardrails: Input validation
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'missing or invalid prompt' });
  if (prompt.length > 500) return res.status(400).json({ error: 'prompt too long (max 500)' });

  // Replay / Versioning: Ensure seed
  if (seed === undefined || seed === null) {
    // Deterministic seed generation or random? Instructions say "If request omits seed, server generates one"
    // Using simple integer for readability/DOOM compat
    seed = Math.floor(Math.random() * 1000000);
  }

  const jobId = crypto.randomUUID();
  const jobState = {
    jobId,
    state: 'queued',
    progress: 0,
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    plugin: plugin || 'stub',
    promptPreview: prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt,
    steps: [],
    // stepIds: new Set(),
    gsi1pk: 'JOB',
    gsi1sk: `${new Date().toISOString()}#${jobId}`,
    ttl: Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60), // 14 days
    input: { prompt, style, seed, plugin, params } // Persist full input for replay
  };

  addToHistory(jobState);

  try {
    if (TABLE_NAME) {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: jobState
      }));
    } else {
      jobs[jobId] = jobState;
    }
    log(`Created scene generation request`, { traceId: jobId, seed });
  } catch (e) {
    console.error(`[Job ${jobId}] Setup failed:`, e);
    return res.status(500).json({ error: 'internal error' });
  }

  // Dispatch to Worker
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

      const selfUrl = process.env.SELF_URL || `http://localhost:${PORT}`;
      const callbackUrl = `${selfUrl}/internal/jobs/${jobId}/step`;
      const workerRes = await fetch(`${WORKER_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          prompt,
          style,
          seed,
          plugin: jobState.plugin,
          params: params,
          callbackUrl
        })
      });

      if (!workerRes.ok) throw new Error(`Worker responded with ${workerRes.status}`);
      const data = await workerRes.json();

      // DONE update logic handled by callback or here?
      // Legacy note: Worker originally returned output synchronously in early slices, but now often uses callbacks.
      // However, current Worker implementation DOES return JSON output at end of process().
      // BUT process() in Worker might be async/long-running? 
      // Checking Worker code: it awaits runSteps and returns final result.
      // So this dual update (here + callback) is a bit redundant but safe due to idempotency if keys align.
      // However, Worker also sends 'done' callback. 
      // We'll leave this as is for now to minimize regression risk.

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
        })).catch(e => console.log("Failed to set error state", e));
      } else if (jobs[jobId]) {
        jobs[jobId].state = 'failed';
        jobs[jobId].error = err.message;
      }
    }
  })();

  res.status(202).json({ jobId, seed, statusUrl: `/status/${jobId}` });
});

// Replay Endpoint
app.post('/jobs/:id/replay', checkConcurrency, async (req, res) => {
  const originalId = req.params.id;

  // Fetch original
  let originalJob;
  if (TABLE_NAME) {
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { jobId: originalId } }));
    originalJob = Item;
  } else {
    originalJob = jobs[originalId];
  }

  if (!originalJob) return res.status(404).json({ error: 'original job not found' });

  // Construct new request payload from original input or infer from fields
  const input = originalJob.input || {}; // If input block exists
  const payload = {
    prompt: input.prompt, // Fallback fields if input obj missing?
    style: input.style,
    seed: originalJob.result?.levelSpec?.seed || input.seed || 12345, // Try to reuse exact seed
    plugin: originalJob.plugin,
    params: input.params
  };

  // Internal redirect or mostly copy-paste logic?
  // Let's call the internal handler or just refetch? 
  // Easiest is to just fetch to self or duplicate logic.
  // Let's duplicate logic for clarity but its verbose. 
  // Or just call the same logic function? 
  // We'll just client-redirect or forward? No, backend replay.

  // Let's just create a new job here reusing the logic above? 
  // Refactoring generate-scene logic into a function `createJob` is best practice.
  // For now, I will just call the worker directly and set up the job, duplicating the setup code slightly.

  // Actually, I can just effectively "do" what generate-scene does.

  const newJobId = crypto.randomUUID();
  const newJobState = {
    ...originalJob,
    jobId: newJobId,
    state: 'queued',
    result: null,
    error: null,
    steps: [],
    stepIds: new Set(),
    createdAt: new Date().toISOString(),
    gsi1sk: `${new Date().toISOString()}#${newJobId}`,
    ttl: Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60),
    input: payload // Keep input
  };

  // Remove DDB specific system keys if any, usually clean.

  try {
    if (TABLE_NAME) {
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: newJobState }));
    } else {
      jobs[newJobId] = newJobState;
    }
  } catch (e) {
    return res.status(500).json({ error: 'replay setup failed' });
  }

  // Dispatch
  (async () => {
    try {
      // Update running
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId: newJobId },
          UpdateExpression: "set #s = :s",
          ExpressionAttributeNames: { "#s": "state" },
          ExpressionAttributeValues: { ":s": "running" }
        }));
      }

      const selfUrl = process.env.SELF_URL || `http://localhost:${PORT}`;
      const callbackUrl = `${selfUrl}/internal/jobs/${newJobId}/step`;

      const workerRes = await fetch(`${WORKER_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: newJobId,
          prompt: payload.prompt,
          style: payload.style,
          seed: payload.seed,
          plugin: payload.plugin,
          params: payload.params,
          callbackUrl
        })
      });

      if (!workerRes.ok) throw new Error(`Worker responded with ${workerRes.status}`);
      const data = await workerRes.json();

      // Done update... (duplicated from above, ideally refactor)
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId: newJobId },
          UpdateExpression: "set #s = :s, progress = :p, #r = :r",
          ExpressionAttributeNames: { "#s": "state", "#r": "result" },
          ExpressionAttributeValues: { ":s": "done", ":p": 1.0, ":r": data.output }
        }));
      }
    } catch (err) {
      console.error(`[Replay ${newJobId}] Failed:`, err);
      // Set failed...
      if (TABLE_NAME) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { jobId: newJobId },
          UpdateExpression: "set #s = :s, #e = :e",
          ExpressionAttributeNames: { "#s": "state", "#e": "error" },
          ExpressionAttributeValues: { ":s": "failed", ":e": err.message }
        })).catch(e => console.log(e));
      }
    }
  })();

  res.status(202).json({ jobId: newJobId, seed: payload.seed, statusUrl: `/status/${newJobId}` });
});

// 2b. Internal Callback for Step Updates (Worker -> Orchestrator)
app.post('/internal/jobs/:id/step', requireInternalToken, async (req, res) => {
  const { id } = req.params;
  const payload = req.body; // { step: {...} }
  const stepData = payload.step;
  const stepId = stepData.stepId || `${id}:${stepData.name}`; // fallback

  // DYNAMODB UPDATE
  if (TABLE_NAME && stepData) {
    try {
      // Idempotent update:
      // 1. Check if stepId already processed
      // 2. Append to steps list
      // 3. Update updatedAt
      // 4. Update state if step dictates it (optional, usually Worker drives this but here we treat step updates as pure steps)
      // Wait, actually orchestrator updates state separately? 
      // The previous code updated state via separate logic? No, worker was calling /steps? 
      // Previous logic just appended.
      // We need simple "Record this step if not seen".

      const params = {
        TableName: TABLE_NAME,
        Key: { jobId: id },
        UpdateExpression: "SET #steps = list_append(if_not_exists(#steps, :empty_list), :new_step), ADD stepIds :sid_set SET updatedAt = :u",
        ConditionExpression: "(attribute_not_exists(stepIds) OR NOT contains(stepIds, :sid)) AND (#s <> :done AND #s <> :failed)",
        ExpressionAttributeNames: { "#steps": "steps", "#s": "state" },
        ExpressionAttributeValues: {
          ":empty_list": [],
          ":new_step": [stepData],
          ":sid_set": new Set([stepId]),
          ":sid": stepId,
          ":u": new Date().toISOString(),
          ":done": "done",
          ":failed": "failed"
        }
      };

      // Also handle state transitions if provided in payload?
      // Worker sends: { step: { ... }, state: 'running' }? 
      // Current payload is just { step: ... }.
      // The previous code had separate calls for state updates? 
      // Ah, looking at Worker code, it called updateJobStatus separately for 'running'/'done'.
      // This endpoint is purely for steps.

      await docClient.send(new UpdateCommand(params));
      return res.json({ ok: true });

    } catch (e) {
      if (e.name === 'ConditionalCheckFailedException') {
        // Already processed or job terminal
        return res.status(200).json({ ok: true, ignored: true });
      }
      console.error("DDB Step Update failed", e);
      return res.status(500).json({ error: e.message });
    }
  }

  // IN-MEMORY FALLBACK
  if (jobs[id] && stepData) {
    if (!jobs[id].stepIds) jobs[id].stepIds = new Set();

    // Idempotency check
    if (jobs[id].stepIds.has(stepId)) {
      return res.json({ ok: true, ignored: true });
    }

    // Terminal check
    if (jobs[id].state === 'done' || jobs[id].state === 'failed') {
      return res.json({ ok: true, ignored: true });
    }

    jobs[id].steps.push(stepData);
    jobs[id].stepIds.add(stepId);

    // Update existing step logic removed, strictly append now as per instructions "1 completed event per step"
  }
  res.json({ ok: true });
});

// 2a. List Jobs
app.get('/jobs', async (req, res) => {
  if (TABLE_NAME) {
    try {
      const { Items } = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'gsi1',
        KeyConditionExpression: 'gsi1pk = :pk',
        ExpressionAttributeValues: { ':pk': 'JOB' },
        ScanIndexForward: false, // newest first
        Limit: 20
      }));
      return res.json(Items || []);
    } catch (e) {
      console.error("DDB Job List failing:", e);
      // Fallback to memory if desired, or error
      return res.status(500).json({ error: "Storage error" });
    }
  }
  res.json(jobHistory);
});

// 2c. OpenAPI
app.get('/openapi.json', (req, res) => {
  res.sendFile(__dirname + '/public/openapi.json', (err) => {
    if (err) res.status(404).json({ error: 'openapi spec not found' });
  });
});
app.get('/docs', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Ghost Engine API</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
      });
    };
    </script>
  </body>
  </html>`);
});

// 2d. Public Demo
app.use('/demo', express.static(__dirname + '/public/demo'));
app.get('/demo', (req, res) => {
  res.sendFile(__dirname + '/public/demo/index.html');
});

// 2e. Play Page
app.get('/play', (req, res) => {
  res.sendFile(__dirname + '/public/play.html');
});
app.get('/play.js', (req, res) => {
  res.sendFile(__dirname + '/public/play.js');
});

// 2f. Artifact Proxy (CORS workaround)
app.get('/artifact/:jobId/levelSpec', async (req, res) => {
  const { jobId } = req.params;

  // 1. Lookup Job
  let job;
  if (TABLE_NAME) {
    const { Item } = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { jobId } }));
    job = Item;
  } else {
    job = jobs[jobId];
  }

  if (!job || !job.result) return res.status(404).json({ error: "Job or result not found" });

  const key = job.result.levelSpecS3Key;
  if (!key) return res.status(404).json({ error: "LevelSpec key not found" });

  // 2. Stream from S3
  try {
    const command = new GetObjectCommand({ Bucket: ARTIFACTS_BUCKET, Key: key });
    const s3Res = await s3Client.send(command);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    s3Res.Body.pipe(res);
  } catch (e) {
    console.error("Proxy fetch failed", e);
    res.status(500).json({ error: "Upstream fetch failed" });
  }
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

      // Presign Artifacts
      if (Item.result && ARTIFACTS_BUCKET) {
        if (Item.result.sceneGraphS3Key) {
          Item.result.sceneGraphUrl = await presignGet(Item.result.sceneGraphS3Key);
        }
        if (Item.result.asciiMinimapS3Key) {
          Item.result.asciiMinimapUrl = await presignGet(Item.result.asciiMinimapS3Key);
        }
        if (Item.result.levelSpecS3Key) {
          Item.result.levelSpecUrl = await presignGet(Item.result.levelSpecS3Key);
        }
        if (Item.result.levelPreviewAsciiS3Key) {
          Item.result.levelPreviewAsciiUrl = await presignGet(Item.result.levelPreviewAsciiS3Key);
        }
      }

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
