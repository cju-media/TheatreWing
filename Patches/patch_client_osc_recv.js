const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const targetOnMessage = `        function sendOscMute(channel, isMuted) {`;
const replacementOnMessage = `        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'FIRE_SCENE') {
                    fireScene(data.id);
                }
            } catch (e) {
                console.error(e);
            }
        };

        function sendOscMute(channel, isMuted) {`;
content = content.replace(targetOnMessage, replacementOnMessage);
fs.writeFileSync('public/index.html', content);
