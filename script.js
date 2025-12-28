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
        const binaryString = atob(input);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // 1. Use UTF-16LE (Standard for PowerShell)
        const decoder = new TextDecoder('utf-16le');
        let decodedText = decoder.decode(bytes);

        // 2. SAFETY CLEANUP: Remove any invisible Null Bytes (\0)
        // This ensures the text is perfectly clean for the scanner
        decodedText = decodedText.replace(/\0/g, '');

        outputBlock.textContent = decodedText;

        // 3. Run Analysis
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
        // Case insensitive search with escaped special characters
        const regex = new RegExp(keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        
        if (regex.test(text)) {
            findings++;
            
            // --- NEW LOGIC START ---
            // Check if the description is marked as "Info" or "Safe"
            let alertClass = 'alert-item'; // Default class
            
            // If the description contains the Info emoji or text, add the 'info' class
            if (description.includes("ℹ️") || description.includes("INFO:")) {
                alertClass += ' info'; 
            } else {
                // Otherwise, assume it is suspicious/danger
                alertClass += ' danger';
            }
            // --- NEW LOGIC END ---

            const div = document.createElement('div');
            div.className = alertClass;
            div.innerHTML = `<span class="keyword">FOUND: ${keyword}</span><span class="desc">${description}</span>`;
            container.appendChild(div);
        }
    }

    if (findings === 0) {
        container.innerHTML = "<p>No specific keywords matched in the dictionary.</p>";
    }
}

function clearFields() {
    document.getElementById('inputParams').value = "";
    document.getElementById('outputCode').textContent = "Waiting for input...";
    document.getElementById('analysisReport').innerHTML = "";
}

// Init
loadDictionary();
