const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

content = content.replace(
    'let sceneLabel = \`Act \${scene.id}\`;',
    'let sceneLabel = \`scene \${scene.id}\`;'
);

content = content.replace(
    'sceneLabel = \`Current (Act \${scene.id})\`;',
    'sceneLabel = \`Current (scene \${scene.id})\`;'
);

fs.writeFileSync('public/index.html', content);
