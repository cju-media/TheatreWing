const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// We need to require 'os' and 'path'
if (!content.includes("const os = require('os');")) {
    content = "const os = require('os');\n" + content;
}
if (!content.includes("const path = require('path');")) {
    content = "const path = require('path');\n" + content;
}

const targetSave = `app.post('/api/save-show', (req, res) => {
    const { path, state } = req.body;
    if (!path || !state) return res.status(400).json({ success: false, message: 'Missing path or state' });

    try {
        fs.writeFileSync(path, JSON.stringify(state, null, 2));
        const config = getConfig();
        config.lastShowPath = path;
        saveConfig(config);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to write file' });
    }
});`;

const replacementSave = `app.post('/api/save-show', (req, res) => {
    const { state } = req.body;
    if (!state) return res.status(400).json({ success: false, message: 'Missing state' });

    try {
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        if (!fs.existsSync(downloadsPath)) {
            fs.mkdirSync(downloadsPath, { recursive: true });
        }

        const savePath = path.join(downloadsPath, 'theatrewing_show.json');
        fs.writeFileSync(savePath, JSON.stringify(state, null, 2));

        const config = getConfig();
        config.lastShowPath = savePath;
        saveConfig(config);

        res.json({ success: true, path: savePath });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to write file' });
    }
});`;

content = content.replace(targetSave, replacementSave);
fs.writeFileSync('server.js', content);
