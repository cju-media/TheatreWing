const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// 1. CSS changes for .scene-body and .scene-header
content = content.replace(
    '.scene-header { background: var(--panel-header); padding: 10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }',
    '.scene-header { background: var(--panel-header); padding: 5px 10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }'
);

content = content.replace(
    '.scene-body { padding: 10px; flex-grow: 1; min-height: 200px; }',
    '.scene-body { padding: 5px 10px; flex-grow: 1; min-height: auto; }'
);

// 2. Adjust padding in the div containing the fire-btn
content = content.replace(
    '<div style="padding:10px; background:#222; border-top:1px solid #333;">',
    '<div style="padding:5px 10px; background:#222; border-top:1px solid #333;">'
);

fs.writeFileSync('public/index.html', content);
