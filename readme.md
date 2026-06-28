# ✨ TokenShrink Pro - Browser Extension

TokenShrink Pro is a lightweight, powerful browser extension built to optimize and compress LLM prompts. By connecting to a custom backend API, it reduces the token count of messy prompts while preserving their core meaning, saving you API costs and context window space.

## 🚀 Features

* **Live Token Counter:** Real-time token calculation as you type, powered by the `cl100k_base` tokenizer used by GPT-4.
* **Smart Prompt Optimization:** Connects to a dedicated backend (`gpt-4o-mini` target model) to condense prompts efficiently.
* **Visual Diff Viewer:** See exactly what changed. The built-in diff viewer highlights deleted (`del`) and inserted (`ins`) text just like a code editor.
* **One-Click Copy:** Easily copy your optimized prompt to the clipboard.
* **Local History & CSV Export:** Automatically saves your last 5 optimizations to Chrome's local storage and allows you to export your token-saving history as a CSV file.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Extension Architecture:** Manifest V3, Chrome Storage API
* **Dependencies (Local):** `tokenizer.js` (for live counting), `diff.js` (for visual text comparisons)
* **Backend:** Connects to a custom REST API (`https://tokenshrink-backend.onrender.com/api/v1/optimize`)

## 📦 How to Install (Local Development)

You can easily install this extension directly into your Chromium-based browser (Chrome, Edge, Brave):

1. Open your browser and navigate to the extensions page:
   * Chrome: `chrome://extensions/`
   * Edge: `edge://extensions/`
   * Brave: `brave://extensions/`
2. Enable **Developer mode** (usually a toggle in the top right corner).
3. Click the **Load unpacked** button.
4. Select the `prompt_optimizer_extension` folder from your local machine.
5. Click the puzzle piece icon in your browser toolbar and pin **TokenShrink Pro** for easy access!

## 💡 Usage

1. Click the extension icon to open the popup.
2. Paste your long, unstructured prompt into the input area.
3. Watch the live token counter calculate your current footprint.
4. Click **Optimize Prompt**.
5. Review the changes in the Diff View, copy the optimized prompt, and check out how many tokens you saved!