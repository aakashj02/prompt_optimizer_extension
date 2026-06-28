document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("optimizeBtn");
  const display = document.getElementById("diffOutput");
  const optimizedOutput = document.getElementById("optimizedOutput");
  const resultArea = document.getElementById("resultArea");

  // 1. Live Token Counter
  input.addEventListener("input", () => {
    // Check if tokenizer library is loaded
    if (typeof GPTTokenizer_cl100k_base !== "undefined") {
      const count = GPTTokenizer_cl100k_base.encode(input.value).length;
      document.getElementById("inputTokens").innerText = `Tokens: ${count}`;
    }
  });

  // 2. Optimize Button
  btn.addEventListener("click", async () => {
    const originalText = input.value;
    if (!originalText) return;

    btn.innerText = "Optimizing...";

    try {
      // popup.js ke fetch call mein ye URL use kar
      const response = await fetch(
        "https://tokenshrink-backend.onrender.com/api/v1/optimize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: originalText,
            target_model: "gpt-4o-mini",
          }),
        },
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Backend response:", data);

      // Check if optimized_prompt exists
      if (!data.optimized_prompt) {
        throw new Error("Invalid response format from server");
      }

      // Populate Diff View
      display.innerHTML = "";
      // Ensure Diff library is loaded
      if (typeof Diff !== "undefined") {
        const diff = Diff.diffWords(originalText, data.optimized_prompt);
        diff.forEach((part) => {
          const span = document.createElement("span");
          span.className = part.added ? "ins" : part.removed ? "del" : "";
          span.textContent = part.value;
          display.appendChild(span);
        });
      }

      // Populate output
      optimizedOutput.value = data.optimized_prompt;
      resultArea.classList.remove("hidden");

      // Save History safely
      const saved = data.metrics ? data.metrics.tokens_saved : 0;
      saveHistory(originalText, saved);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("API Error: " + error.message);
    } finally {
      btn.innerText = "Optimize Prompt";
    }
  });

  // 3. Copy Button Logic
  document.getElementById("copyBtn").addEventListener("click", () => {
    optimizedOutput.select();
    document.execCommand("copy");
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.innerText = "Copied! ✔";
    setTimeout(() => (copyBtn.innerText = "Copy Prompt"), 2000);
  });

  // 4. Export CSV Button
  document.getElementById("exportBtn").addEventListener("click", () => {
    chrome.storage.local.get({ history: [] }, (res) => {
      let csv = "Time,Prompt,Saved\n";
      res.history.forEach((h) => {
        csv += `${h.time},"${h.text.replace(/"/g, '""')}",${h.saved}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "history.csv";
      a.click();
    });
  });

  loadHistory();
});

// Helper Functions
function saveHistory(text, saved) {
  chrome.storage.local.get({ history: [] }, (res) => {
    const entry = {
      text: text.substring(0, 25),
      saved,
      time: new Date().toLocaleTimeString(),
    };
    chrome.storage.local.set(
      { history: [entry, ...res.history].slice(0, 5) },
      loadHistory,
    );
  });
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;
  chrome.storage.local.get({ history: [] }, (result) => {
    historyList.innerHTML = result.history
      .map(
        (item) =>
          `<li>${item.time} | ${item.text}... <b>(${item.saved} saved)</b></li>`,
      )
      .join("");
  });
}
