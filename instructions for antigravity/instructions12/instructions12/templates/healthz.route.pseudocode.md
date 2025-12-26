# /healthz route pseudocode (Orchestrator)

```ts
app.get("/healthz", async (req, res) => {
  const out = {
    ok: true,
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "unknown",
    deps: {
      dynamodb: "unknown",
      s3: "unknown",
      internalToken: Boolean(process.env.INTERNAL_TOKEN),
    }
  };

  // Best-effort checks (optional):
  // out.deps.dynamodb = await pingDynamo() ? "ok" : "fail";
  // out.deps.s3 = await pingS3() ? "ok" : "fail";

  res.status(200).json(out);
});
```
