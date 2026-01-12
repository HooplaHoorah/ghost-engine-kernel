// Orchestrator: add /healthz
app.get("/healthz", async (req, res) => {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || "unknown",
    configured: {
      JOBS_TABLE_NAME: Boolean(process.env.JOBS_TABLE_NAME),
      ARTIFACTS_BUCKET: Boolean(process.env.ARTIFACTS_BUCKET),
      INTERNAL_TOKEN: Boolean(process.env.INTERNAL_TOKEN),
    },
  });
});
