let commandMap = {};

// 1. Fetch the dictionary when the page loads
async function loadDictionary() {
    try {
        const response = await fetch('cmdlet_map.json');
        commandMap = await response.json();
        console.log("Threat Dictionary Loaded");
    } catch (error) {
        console.error("Failed to load dictionary:", error);
        document.getElementById('analysisReport').innerHTML = "<div class='alert-item'>Error: Could not load dictionary file.</div>";
    }
}

// 2. The core logic
function decodeAndAnalyze() {
    const input = document.getElementById('inputParams').value.trim();
    const outputBlock = document.getElementById('outputCode');
    const reportBlock = document.getElementById('analysisReport');
    
    if (!input) {
        alert("Please enter a Base64 string.");
        return;
    }

    try {
        // --- DECODING LOGIC ---
        // PowerShell Base64 is usually UTF-16LE. 
        // Standard atob() creates a binary string, we need to convert that to bytes
        // and then decode those bytes as UTF-16LE.
        const binaryString = atob(input);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const decoder = new TextDecoder('utf-16le');
        let decodedText = decoder.decode(bytes);
        
        // Sanity Check: If the result looks like Chinese characters or nonsense, 
        // it might actually have been UTF-8 (standard web B64). 
        // A simple check is looking for null characters which are common in UTF-16LE.
        // If the decoded text looks bizarre, we can try UTF-8 fallback.
        if (decodedText.includes('')) {
             const utf8Decoder = new TextDecoder('utf-8');
             decodedText = utf8Decoder.decode(bytes);
        }

        outputBlock.textContent = decodedText;

        // --- ANALYSIS LOGIC ---
        analyzeText(decodedText, reportBlock);

    } catch (e) {
        outputBlock.textContent = "Error: Invalid Base64 string.";
        console.error(e);
    }
}

function analyzeText(text, container) {
    container.innerHTML = ""; // Clear previous results
    let findings = 0;

    // Loop through the loaded JSON dictionary
    for (const [keyword, description] of Object.entries(commandMap)) {
        // Case insensitive search
        const regex = new RegExp(keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        
        if (regex.test(text)) {
            findings++;
            const div = document.createElement('div');
            div.className = 'alert-item';
            div.innerHTML = `<span class="keyword">FOUND: ${keyword}</span><span class="desc">${description}</span>`;
            container.appendChild(div);
        }
    }

    if (findings === 0) {
        container.innerHTML = "<p>No specific suspicious keywords matched in the dictionary.</p>";
    }
}

function clearFields() {
    document.getElementById('inputParams').value = "";
    document.getElementById('outputCode').textContent = "Waiting for input...";
    document.getElementById('analysisReport').innerHTML = "";
}

// Init
loadDictionary();