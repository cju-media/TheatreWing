const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Update CSS
const cssTarget = `        .scene-actor-row {
            background: #252525; padding: 6px; margin: 4px 0; border-radius: 4px;
            display: flex; justify-content: space-between; font-size: 0.9em;
        }`;
const cssReplacement = `        .scene-actors-container { display: flex; flex-wrap: wrap; gap: 5px; }
        .scene-actor-row {
            background: #252525; padding: 4px 8px; border-radius: 4px;
            display: inline-flex; align-items: center; gap: 8px; font-size: 0.85em;
        }`;

content = content.replace(cssTarget, cssReplacement);

// Make headings tighter
content = content.replace(
    '<h4 style="margin:0 0 10px 0; color:var(--accent);">${scene.name}</h4>',
    '<h4 style="margin:0 0 5px 0; font-size: 1em; color:var(--accent);">${scene.name}</h4>'
);

// Wrap actorRows in container
content = content.replace(
    '<div>${actorRows}</div>',
    '<div class="scene-actors-container">${actorRows}</div>'
);

fs.writeFileSync('public/index.html', content);
