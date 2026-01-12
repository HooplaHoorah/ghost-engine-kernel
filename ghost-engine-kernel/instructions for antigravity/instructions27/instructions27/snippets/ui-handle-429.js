// Handle 429 with Retry-After (returns {res, data})
export async function fetchJsonWith429(url, opts = {}) {
  const res = await fetch(url, opts);
  if (res.status !== 429) {
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  const retryAfterHeader = res.headers.get("Retry-After");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : 3;

  return {
    res,
    data: {
      error: "rate_limited",
      message: "Rate limited — please retry shortly.",
      retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : 3,
    },
  };
}
