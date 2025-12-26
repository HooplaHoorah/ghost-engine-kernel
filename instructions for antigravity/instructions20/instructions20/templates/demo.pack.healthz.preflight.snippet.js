// /healthz preflight for pack generation (demo.js)
async function healthzPreflight() {
  const hz = await api("/healthz", { method:"GET" });
  if (!hz.res.ok) {
    throw new Error(`healthz HTTP ${hz.res.status}`);
  }
  const j = hz.json || {};
  // Optional strictness based on configured deps
  if (j.configured?.JOBS_TABLE_NAME && j.checks?.ddb === false) {
    throw new Error("healthz: DynamoDB check failed");
  }
  if (j.configured?.ARTIFACTS_BUCKET && j.checks?.s3 === false) {
    throw new Error("healthz: S3 check failed");
  }
  return j;
}
