// Disable a button while async work is in-flight
export function withInFlight(buttonEl, fnAsync) {
  return async (...args) => {
    if (!buttonEl || buttonEl.disabled) return;
    buttonEl.disabled = true;
    buttonEl.dataset.prevText = buttonEl.textContent;
    buttonEl.textContent = "Working…";
    try {
      return await fnAsync(...args);
    } finally {
      buttonEl.disabled = false;
      if (buttonEl.dataset.prevText) buttonEl.textContent = buttonEl.dataset.prevText;
    }
  };
}
