const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client } = require('node-osc');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const WING_IP = '192.168.1.100'; // Change to your WING IP
const WING_PORT = 2223;
const SERVER_PORT = 3000;

const oscClient = new Client(WING_IP, WING_PORT);

app.use(express.static('public'));

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