const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Update header HTML
const headerTarget = `<div style="display: flex; gap: 10px; align-items: center;">
            <button onclick="saveShow()" style="background: #10ac84;">💾 Save Show</button>
            <button onclick="document.getElementById('fileInput').click()" style="background: #341f97;">📂 Load Show</button>
            <input type="file" id="fileInput" accept=".json" style="display: none;" onchange="loadShow(event)">
            <button class="mode-toggle" onclick="toggleEditMode()">⚙️ Toggle Edit Mode</button>
            <span id="status" class="badge disconnected">Disconnected</span>
        </div>`;

const headerReplacement = `<div style="display: flex; gap: 10px; align-items: center;">
            <button onclick="saveShowPrompt()" style="background: #10ac84;">💾 Save Show</button>
            <button onclick="loadShowPrompt()" style="background: #341f97;">📂 Load Show</button>
            <button class="mode-toggle" onclick="toggleEditMode()">⚙️ Toggle Edit Mode</button>
            <span id="status" class="badge disconnected">Disconnected</span>
        </div>`;
content = content.replace(headerTarget, headerReplacement);

// Update save/load JS logic
const jsTarget = `        // --- SAVE / LOAD SHOW ---
        function saveShow() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "theatrewing_show.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        function loadShow(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loadedState = JSON.parse(e.target.result);
                    if (loadedState.characters && loadedState.scenes) {
                        state = loadedState;
                        activeSceneId = null;
                        renderUI();
                    } else {
                        alert("Invalid show file.");
                    }
                } catch (err) {
                    alert("Error parsing JSON file.");
                }
            };
            reader.readAsText(file);
            // Reset input so the same file can be loaded again
            event.target.value = '';
        }`;

const jsReplacement = `        // --- SAVE / LOAD SHOW ---
        async function saveShowPrompt() {
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
        }

        async function loadShowPrompt() {
            const path = prompt("Enter absolute file path to load the show (e.g., /path/to/show.json):");
            if (!path) return;
            try {
                const res = await fetch('/api/load-show', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path })
                });
                const data = await res.json();
                if (data.success) {
                    if (data.state && data.state.characters && data.state.scenes) {
                        state = data.state;
                        activeSceneId = null;
                        renderUI();
                        alert("Show loaded successfully.");
                    } else {
                        alert("Invalid show file format.");
                    }
                } else {
                    alert("Error loading show: " + data.message);
                }
            } catch (e) {
                alert("Failed to load show.");
            }
        }`;
content = content.replace(jsTarget, jsReplacement);

// Add fetch to last-show on boot
const bootTarget = `        // Boot Init Execution
        renderUI();
    </script>`;

const bootReplacement = `        // Boot Init Execution
        async function boot() {
            try {
                const res = await fetch('/api/last-show');
                const data = await res.json();
                if (data.success && data.state && data.state.characters && data.state.scenes) {
                    state = data.state;
                }
            } catch (e) {
                console.error("Failed to fetch last show", e);
            }
            renderUI();
        }
        boot();
    </script>`;
content = content.replace(bootTarget, bootReplacement);

fs.writeFileSync('public/index.html', content);
