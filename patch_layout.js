const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Ensure that in non-edit mode, the workspace grid collapses the sidebar
const cssTarget = `        /* App Layout */
        .workspace { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }`;

const cssReplacement = `        /* App Layout */
        .workspace { display: grid; grid-template-columns: 1fr; gap: 20px; }
        body.edit-mode .workspace { grid-template-columns: 300px 1fr; }`;
content = content.replace(cssTarget, cssReplacement);

fs.writeFileSync('public/index.html', content);
