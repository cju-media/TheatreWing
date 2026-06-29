const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const targetAppUse = "app.use(express.static('public'));";
const replacementAppUse = `app.use(express.static('public'));
app.use(express.json());

const CONFIG_FILE = 'config.json';

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

app.get('/api/last-show', (req, res) => {
    const config = getConfig();
    if (config.lastShowPath && fs.existsSync(config.lastShowPath)) {
        try {
            const showData = fs.readFileSync(config.lastShowPath, 'utf8');
            res.json({ success: true, state: JSON.parse(showData) });
        } catch (e) {
            res.json({ success: false, message: 'Could not parse last show file' });
        }
    } else {
        res.json({ success: false, message: 'No last show found' });
    }
});

app.post('/api/save-show', (req, res) => {
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
});

app.post('/api/load-show', (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ success: false, message: 'Missing path' });

    try {
        if (!fs.existsSync(path)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        const showData = fs.readFileSync(path, 'utf8');
        const state = JSON.parse(showData);

        const config = getConfig();
        config.lastShowPath = path;
        saveConfig(config);

        res.json({ success: true, state });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to read or parse file' });
    }
});
`;

content = content.replace(targetAppUse, replacementAppUse);
// we need to add fs require if not present
if (!content.includes("const fs = require('fs');")) {
    content = "const fs = require('fs');\n" + content;
}

fs.writeFileSync('server.js', content);
