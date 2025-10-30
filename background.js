chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scanPage") {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) {
          sendResponse({ success: false, error: "No active tab found" });
          return;
        }

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });

        sendResponse({ success: true });
      } catch (err) {
        console.error("Script injection failed:", err);
        sendResponse({ success: false, error: err.message });
      }
    })();

    // ✅ Keep the message channel open for the async response
    return true;
  }
});