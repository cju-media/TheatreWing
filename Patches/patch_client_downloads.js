const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const targetButton = '<button onclick="saveShowPrompt()" style="background: #10ac84;">💾 Save Show</button>';
const replacementButton = '<button onclick="saveShow()" style="background: #10ac84;">💾 Save Show</button>';
content = content.replace(targetButton, replacementButton);

const targetFunction = `        async function saveShowPrompt() {
            const path = prompt("Enter absolute file path to save the show (e.g., /path/to/show.json):");
            if (!path) return;
            try {
                const res = await fetch('/api/save-show', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path, state })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Show saved successfully.");
                } else {
                    alert("Error saving show: " + data.message);
                }
            } catch (e) {
                alert("Failed to save show.");
            }
        }`;

const replacementFunction = `        async function saveShow() {
            try {
                const res = await fetch('/api/save-show', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ state })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Show saved successfully to: " + data.path);
                } else {
                    alert("Error saving show: " + data.message);
                }
            } catch (e) {
                alert("Failed to save show.");
            }
        }`;

content = content.replace(targetFunction, replacementFunction);
fs.writeFileSync('public/index.html', content);
