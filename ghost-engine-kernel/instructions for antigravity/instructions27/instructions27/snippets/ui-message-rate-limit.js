// Friendly rate-limit message with countdown
export function showRateLimit(msgEl, retryAfterSeconds) {
  if (!msgEl) return;
  msgEl.textContent = `Rate limited — try again in ${retryAfterSeconds}s.`;
  msgEl.style.display = "block";
  let remaining = retryAfterSeconds;
  const t = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(t);
      msgEl.textContent = "";
      msgEl.style.display = "none";
    } else {
      msgEl.textContent = `Rate limited — try again in ${remaining}s.`;
    }
  }, 1000);
}
