document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const statusEl = document.getElementById("status");

  scanBtn.addEventListener("click", () => {
    statusEl.textContent = "Scanning...";
    statusEl.className = "status";

    chrome.runtime.sendMessage({ action: "scanPage" }, (response) => {
      if (chrome.runtime.lastError) {
        statusEl.textContent = "Error: " + chrome.runtime.lastError.message;
        statusEl.classList.add("error");
      } else if (response && response.success) {
        statusEl.textContent = "✅ Scan complete! Check page overlay.";
        statusEl.classList.add("success");
      } else {
        statusEl.textContent = "⚠️ Failed: " + (response?.error || "Unknown error");
        statusEl.classList.add("error");
      }
    });
  });
});
