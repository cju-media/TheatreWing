const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Header buttons
const headerTarget = `    <header>
        <h2>🎭 TheatreWing</h2>
        <div>
            <button class="mode-toggle" onclick="toggleEditMode()">⚙️ Toggle Edit Mode</button>
            <span id="status" class="badge disconnected">Disconnected</span>
        </div>
    </header>`;

const headerReplacement = `    <header>
        <h2>🎭 TheatreWing</h2>
        <div style="display: flex; gap: 10px; align-items: center;">
            <button onclick="saveShow()" style="background: #10ac84;">💾 Save Show</button>
            <button onclick="document.getElementById('fileInput').click()" style="background: #341f97;">📂 Load Show</button>
            <input type="file" id="fileInput" accept=".json" style="display: none;" onchange="loadShow(event)">
            <button class="mode-toggle" onclick="toggleEditMode()">⚙️ Toggle Edit Mode</button>
            <span id="status" class="badge disconnected">Disconnected</span>
        </div>
    </header>`;
content = content.replace(headerTarget, headerReplacement);

// JS logic for save/load
const jsTarget = `        // --- CONTROL LAYER ---
        function toggleEditMode() {`;

const jsReplacement = `        // --- SAVE / LOAD SHOW ---
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
        }

        // --- CONTROL LAYER ---
        function toggleEditMode() {`;
content = content.replace(jsTarget, jsReplacement);

fs.writeFileSync('public/index.html', content);
