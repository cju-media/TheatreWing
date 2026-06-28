const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const cssTarget1 = `        /* Scenes Layout */
        .scenes-grid { display: flex; flex-direction: column; gap: 20px; overflow-y: auto; padding-bottom: 10px; max-height: 80vh; }
        .scene-card {
            background: var(--panel); min-width: 260px; max-width: 260px; border-radius: 8px;
            border: 2px solid #333; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s;
        }
        .scene-card.active { border-color: var(--accent-green); transform: scale(1.02); background: #17251f; }`;

const cssReplacement1 = `        /* Scenes Layout */
        .scenes-grid { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding-bottom: 10px; max-height: 80vh; }
        .scene-card {
            background: var(--panel); border-radius: 8px; width: 100%;
            border: 2px solid #333; display: flex; flex-direction: column; transition: border-color 0.2s;
        }
        .scene-card.active { border-color: var(--accent-green); background: #17251f; }`;

content = content.replace(cssTarget1, cssReplacement1);
fs.writeFileSync('public/index.html', content);
