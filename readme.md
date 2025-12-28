# PowerShell-Decoder 🛡️

A secure, client-side web application to decode obfuscated PowerShell commands and analyze them for malicious intent.

**[🔗 Live Demo](https://samdavi.github.io/Powershell-Decoder/)**

---

## 🚀 Why this tool?

Security analysts frequently encounter PowerShell commands obscured by Base64 encoding (e.g., via the `-EncodedCommand` or `-enc` flags). 

1.  **The Problem:** Standard Base64 decoders often fail with PowerShell because PowerShell uses **UTF-16LE** encoding. If you use a standard decoder, you get "garbage" text with null bytes (e.g., `c.o.m.m.a.n.d.`).
2.  **The Solution:** This tool specifically handles the UTF-16LE decoding to produce clean, readable code.
3.  **The Analysis:** It automatically scans the decoded output against a local dictionary (`cmdlet_map.json`) to flag suspicious commands like `Invoke-Expression`, `Net.WebClient`, or `Bypass`.

## 🔒 Privacy & Security

**Everything happens in your browser.**

* **Client-Side Only:** No data is sent to any server. The decoding and analysis logic runs entirely in JavaScript within your browser session.
* **Safe for Analysis:** You can safely paste sensitive logs or malware samples here without fear of data exfiltration.

## 📂 Project Structure

* `index.html`: The user interface.
* `script.js`: Handles the Base64 decoding (UTF-16LE logic) and dictionary matching.
* `cmdlet_map.json`: A JSON database containing known malicious PowerShell keywords and their descriptions.
* `style.css`: Dark-mode terminal styling.

## 🛠️ How to Contribute

The "brain" of the analyzer is the `cmdlet_map.json` file. If you find a new obfuscation technique or malicious flag, please submit a Pull Request!

**To add a new definition:**
1. Open `cmdlet_map.json`.
2. Add a new line: `"KEYWORD": "DESCRIPTION"`.
3. Submit a PR.

## 💻 Running Locally

If you prefer not to use the hosted version, you can run it locally:

1. Clone the repo:
   ```bash
   git clone [https://github.com/samdavi/Powershell-Decoder.git](https://github.com/samdavi/Powershell-Decoder.git)
