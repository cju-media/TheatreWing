const fs = require('fs');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('node-osc');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const WING_IP = '192.168.1.100'; // Change to your WING IP
const WING_PORT = 2223;
const SERVER_PORT = 1476;

const oscClient = new Client(WING_IP, WING_PORT);

app.use(express.static('public'));
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


wss.on('connection', (ws) => {
    console.log('Browser connected');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'OSC_CMD') {
                console.log(`OSC Out: ${data.address} -> ${data.args[0].value}`);
                oscClient.send(data.address, data.args);
            }
        } catch (e) { console.error(e); }
    });
});

server.listen(SERVER_PORT, () => {
    console.log(`🚀 Server running on http://localhost:${SERVER_PORT}`);
});