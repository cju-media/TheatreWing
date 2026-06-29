const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const targetOscImport = "const { Client } = require('node-osc');";
const replacementOscImport = "const { Client, Server } = require('node-osc');";
content = content.replace(targetOscImport, replacementOscImport);

const targetServerListen = `server.listen(SERVER_PORT, () => {
    console.log(\`🚀 Server running on http://localhost:\${SERVER_PORT}\`);
});`;

const replacementServerListen = `// --- OSC RECEIVER ---
// Listen for incoming OSC to trigger scenes
const oscServer = new Server(2224, '0.0.0.0', () => {
    console.log('OSC Server is listening on port 2224 for incoming commands.');
});

oscServer.on('message', (msg) => {
    // Example format: ['/theatrewing/go', 1.5] or ['/scene/current', 1.5]
    const address = msg[0];
    if (address === '/theatrewing/go' || address === '/scene/current') {
        const sceneId = msg[1];
        console.log(\`Received OSC trigger for scene: \${sceneId}\`);

        // Broadcast to all connected websocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'FIRE_SCENE', id: sceneId }));
            }
        });
    }
});

server.listen(SERVER_PORT, () => {
    console.log(\`🚀 Server running on http://localhost:\${SERVER_PORT}\`);
});`;

content = content.replace(targetServerListen, replacementServerListen);
fs.writeFileSync('server.js', content);
