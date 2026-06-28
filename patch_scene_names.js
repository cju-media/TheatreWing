const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

content = content.replace(
    'let sceneLabel = \`scene \${scene.id}\`;',
    'let sceneLabel = \`Scene \${scene.id}\`;'
);

content = content.replace(
    'sceneLabel = \`Current (scene \${scene.id})\`;',
    'sceneLabel = \`Current (Scene \${scene.id})\`;'
);

fs.writeFileSync('public/index.html', content);
