const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Update sceneLabel
const targetLabel1 = 'let sceneLabel = \`Scene \${scene.id}\`;';
const replacementLabel1 = 'let sceneLabel = \`\${scene.id}. \${scene.name}\`;';
content = content.replace(targetLabel1, replacementLabel1);

const targetLabel2 = 'sceneLabel = \`Current (Scene \${scene.id})\`;';
const replacementLabel2 = 'sceneLabel = \`Current (\${scene.id}. \${scene.name})\`;';
content = content.replace(targetLabel2, replacementLabel2);

// Remove the <h4> subtitle
const targetSubtitle = '                            <h4 style="margin:0 0 5px 0; font-size: 1em; color:var(--accent);">${scene.name}</h4>';
content = content.replace(targetSubtitle, '');

fs.writeFileSync('public/index.html', content);
