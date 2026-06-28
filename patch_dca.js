const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// The WING DCA assign address is usually /ch/01/group/dca/{1..8} -> 1 or 0
// Or /ch/01/dca
// I will use /ch/01/dca as an integer, or maybe just send `/ch/${formattedChannel}/group/dca/${dcaIndex}`
// Since I don't know the exact OSC API for WING DCA assignment, I will assume it's `/ch/${formattedChannel}/dca` or similar to X32 which uses `/ch/${formattedChannel}/grp/dca` bitmask.
// Actually, let's use `/ch/${formattedChannel}/dca` with an integer argument. Or the user's setup might be using another node-osc translation.
// I will use `/ch/${formattedChannel}/group/dca/${dcaGroup}` with value 1 (on) and turn off others? Wait. DCA assignment in WING is 1-8. I'll just send `/ch/${formattedChannel}/dca` with the dcaGroup as an integer.

const replaceDcaFunc = `        function sendOscDca(channel, dcaGroup) {
            if (!dcaGroup) return; // Unassign is maybe 0?
            const formattedChannel = String(channel).padStart(2, '0');
            const payload = {
                type: 'OSC_CMD',
                address: \`/ch/\${formattedChannel}/dca\`,
                args: [{ type: 'i', value: parseInt(dcaGroup) }]
            };
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
        }

        // --- UI DRAW ENGINE ---`;
content = content.replace('        // --- UI DRAW ENGINE ---', replaceDcaFunc);

// State needs to handle dcas in scenes. The user said: "Allow DCA assignments to change for each scene too. Display the character's DCA assignment. Do not change the DCA assignment between scenes even if a character is not in that scene. Only change DCA assignments when the user changes them in a scene"
// So scene has `dcas: {}`.

content = content.replace(
    'scenes: []      // Array of { id: float/int, name: string, actors: [charIds] }',
    'scenes: []      // Array of { id: float/int, name: string, actors: [charIds], dcas: {charId: dcaIndex} }'
);

// Initial data:
content = content.replace(
    '{ id: 1.0, name: "The Aaron Burr, Sir", actors: ["c1", "c2"] }',
    '{ id: 1.0, name: "The Aaron Burr, Sir", actors: ["c1", "c2"], dcas: {} }'
);
content = content.replace(
    '{ id: 1.5, name: "Eliza Enters", actors: ["c1", "c2", "c3"] }',
    '{ id: 1.5, name: "Eliza Enters", actors: ["c1", "c2", "c3"], dcas: {} }'
);
content = content.replace(
    '{ id: 2.0, name: "My Shot", actors: ["c1", "c2"] }',
    '{ id: 2.0, name: "My Shot", actors: ["c1", "c2"], dcas: {} }'
);

content = content.replace(
    'state.scenes.push({ id, name, actors: [] });',
    'state.scenes.push({ id, name, actors: [], dcas: {} });'
);

// We'll update the CSS for the scenes grid to be vertical, and add a sidebar layout
const cssTarget = `        /* Scenes Layout */
        .scenes-grid { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 10px; }`;
const cssReplacement = `        /* Scenes Layout */
        .scenes-grid { display: flex; flex-direction: column; gap: 20px; overflow-y: auto; padding-bottom: 10px; max-height: 80vh; }`;
content = content.replace(cssTarget, cssReplacement);

const workspaceTarget = `    <div class="workspace">
        <div class="panel">`;
const workspaceReplacement = `    <div class="workspace">
        <div class="panel edit-only" id="characterBankSidebar">`;
content = content.replace(workspaceTarget, workspaceReplacement);

// RenderUI modifications for DCA dropdowns and displaying DCA assignments
const actorRowsTarget = `                    actorRows += \`
                        <div class="scene-actor-row">
                            <span>\${actor.name}</span>
                            <span>
                                <small style="color:#888">CH \${actor.channel}</small>
                                <button class="delete-btn edit-only" style="padding:1px 4px; font-size:0.7em;" onclick="removeActorFromScene('\${scene.id}', '\${charId}')">x</button>
                            </span>
                        </div>\`;`;

const actorRowsReplacement = `
                    // Fallback to older scenes missing the dcas object
                    if (!scene.dcas) scene.dcas = {};
                    const dcaAssignment = scene.dcas[charId];
                    let dcaDisplay = dcaAssignment ? \`DCA \${dcaAssignment}\` : 'No DCA';

                    actorRows += \`
                        <div class="scene-actor-row">
                            <span>\${actor.name}</span>
                            <span style="display:flex; align-items:center; gap: 8px;">
                                <span class="edit-only">
                                    <select style="padding:2px; font-size:0.8em;" onchange="updateCharacterDca('\${scene.id}', '\${charId}', this.value)">
                                        <option value="">No DCA</option>
                                        \${[1,2,3,4,5,6,7,8].map(i => \`<option value="\${i}" \${dcaAssignment == i ? 'selected' : ''}>DCA \${i}</option>\`).join('')}
                                    </select>
                                </span>
                                <span class="badge" style="background:#5f27cd;">\${dcaDisplay}</span>
                                <small style="color:#888">CH \${actor.channel}</small>
                                <button class="delete-btn edit-only" style="padding:1px 4px; font-size:0.7em;" onclick="removeActorFromScene('\${scene.id}', '\${charId}')">x</button>
                            </span>
                        </div>\`;`;
content = content.replace(actorRowsTarget, actorRowsReplacement);

// Add updateCharacterDca function
content = content.replace(
    'function removeActorFromScene(sceneId, charId) {',
    `function updateCharacterDca(sceneId, charId, dcaValue) {
            const scene = state.scenes.find(s => String(s.id) === String(sceneId));
            if(scene) {
                if (!scene.dcas) scene.dcas = {};
                scene.dcas[charId] = dcaValue;
            }
            renderUI();
        }

        function removeActorFromScene(sceneId, charId) {`
);

// Send DCA in fireScene
const fireSceneTarget = `            // Command Loop: Unmute characters inside this scene, Mute any bank characters that aren't
            Object.values(state.characters).forEach(char => {
                if (activeChannels.includes(char.channel)) {
                    sendOscMute(char.channel, false); // Active / Unmuted
                } else {
                    sendOscMute(char.channel, true);  // Muted
                }
            });`;

const fireSceneReplacement = `            // Apply DCA changes for this scene
            if (!targetScene.dcas) targetScene.dcas = {};
            Object.entries(targetScene.dcas).forEach(([charId, dcaValue]) => {
                if (dcaValue && state.characters[charId]) {
                    sendOscDca(state.characters[charId].channel, dcaValue);
                }
            });

            // Command Loop: Unmute characters inside this scene, Mute any bank characters that aren't
            Object.values(state.characters).forEach(char => {
                if (activeChannels.includes(char.channel)) {
                    sendOscMute(char.channel, false); // Active / Unmuted
                } else {
                    sendOscMute(char.channel, true);  // Muted
                }
            });`;
content = content.replace(fireSceneTarget, fireSceneReplacement);

fs.writeFileSync('public/index.html', content);
