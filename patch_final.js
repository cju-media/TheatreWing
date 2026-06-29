const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// 1. Update Title and Header
content = content.replace('<title>WING Theater Director</title>', '<title>TheatreWing</title>');
content = content.replace('<h2>🎭 WING Theater State Engine</h2>', '<h2>🎭 TheatreWing</h2>');

// 2. Remove "Current" label
const labelTarget = `                let sceneLabel = \`\${scene.id}. \${scene.name}\`;
                if (!isEditMode) {
                    if (scene.id === activeSceneId || (activeSceneId === null && index === 0)) {
                        sceneLabel = \`Current (\${scene.id}. \${scene.name})\`;
                    }
                }`;
const labelReplacement = `                let sceneLabel = \`\${scene.id}. \${scene.name}\`;`;
content = content.replace(labelTarget, labelReplacement);

fs.writeFileSync('public/index.html', content);
