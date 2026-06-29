const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Initialize safeDCAs state
content = content.replace(
    'scenes: []      // Array of { id: float/int, name: string, actors: [charIds], dcas: {charId: dcaIndex} }',
    'scenes: [],     // Array of { id: float/int, name: string, actors: [charIds], dcas: {charId: dcaIndex} }\n            safeDCAs: []    // Array of ints (1-16)'
);

// Add toggleSafeDca function
const jsTarget = '        function toggleEditMode() {';
const jsReplacement = `        function toggleSafeDca(dcaId) {
            dcaId = parseInt(dcaId);
            if (!state.safeDCAs) state.safeDCAs = [];
            if (state.safeDCAs.includes(dcaId)) {
                state.safeDCAs = state.safeDCAs.filter(id => id !== dcaId);
            } else {
                state.safeDCAs.push(dcaId);
            }
            renderUI();
        }

        function toggleEditMode() {`;
content = content.replace(jsTarget, jsReplacement);

// Render Safe DCAs checkboxes in the Character Bank Sidebar
const bankSidebarTarget = `<div id="characterBankPool"></div>`;
const bankSidebarReplacement = `<div id="characterBankPool"></div>

            <div class="edit-controls" style="margin-top:20px;">
                <h4 style="margin:0;">Safe DCAs (Do Not Use)</h4>
                <div style="display:flex; flex-wrap:wrap; gap:10px; font-size:0.85em;" id="safeDcasPool"></div>
            </div>`;
content = content.replace(bankSidebarTarget, bankSidebarReplacement);

// Generate checkboxes and update the Select options
const renderTarget = `// Render Bank
            const bankPool = document.getElementById('characterBankPool');`;
const renderReplacement = `if (!state.safeDCAs) state.safeDCAs = [];

            // Render Safe DCAs
            const safeDcasPool = document.getElementById('safeDcasPool');
            if (safeDcasPool) {
                safeDcasPool.innerHTML = '';
                for(let i=1; i<=16; i++) {
                    const isSafe = state.safeDCAs.includes(i);
                    safeDcasPool.innerHTML += \`
                        <label style="display:flex; align-items:center; gap:4px; \${isSafe ? 'color:var(--accent); font-weight:bold;' : ''}">
                            <input type="checkbox" onchange="toggleSafeDca(\${i})" \${isSafe ? 'checked' : ''}> DCA \${i}
                        </label>
                    \`;
                }
            }

            // Render Bank
            const bankPool = document.getElementById('characterBankPool');`;
content = content.replace(renderTarget, renderReplacement);

// Update dropdowns to only show non-safe DCAs, and go up to 16
const optionsTarget = `\${[1,2,3,4,5,6,7,8].map(i => \`<option value="\${i}" \${dcaAssignment == i ? 'selected' : ''}>DCA \${i}</option>\`).join('')}`;
const optionsReplacement = `\${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
                                            .filter(i => (!state.safeDCAs || !state.safeDCAs.includes(i)) || dcaAssignment == i)
                                            .map(i => \`<option value="\${i}" \${dcaAssignment == i ? 'selected' : ''}>DCA \${i}</option>\`)
                                            .join('')}`;
content = content.replace(optionsTarget, optionsReplacement);

fs.writeFileSync('public/index.html', content);
