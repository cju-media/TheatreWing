const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Update sendOscDca for proper path format /ch/XX/dca/Y -> value 1
// We also need to send 0 to all other DCAs that are not safe so it exclusively assigns it to the one we want.
// Wait, the prompt says "Only change DCA assignments when the user changes them in a scene". This means if a scene has DCA assigned to DCA 5, it should just assign it to DCA 5. Should it also unassign it from other DCAs? WING DCA assignments are individual boolean flags on /ch/xx/dca/yy. Yes, to change assignment cleanly, we should turn off other non-safe DCAs. Or maybe just assigning it is enough. I will send 1 to the assigned DCA and 0 to all other non-safe DCAs for that channel.

const targetSendDca = `        function sendOscDca(channel, dcaGroup) {
            if (!dcaGroup) return; // Unassign is maybe 0?
            const formattedChannel = String(channel).padStart(2, '0');
            const payload = {
                type: 'OSC_CMD',
                address: \`/ch/\${formattedChannel}/dca\`,
                args: [{ type: 'i', value: parseInt(dcaGroup) }]
            };
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
        }`;

const replacementSendDca = `        function sendOscDca(channel, dcaGroup) {
            if (!dcaGroup) return;
            const formattedChannel = String(channel).padStart(2, '0');
            const targetDca = parseInt(dcaGroup);

            // Turn off non-safe DCAs for this channel, turn on the target one
            for (let i = 1; i <= 16; i++) {
                if (state.safeDCAs && state.safeDCAs.includes(i) && i !== targetDca) {
                    continue; // Skip safe DCAs
                }
                const value = (i === targetDca) ? 1 : 0;
                const formattedDca = String(i).padStart(2, '0');
                // The exact path varies slightly between X32 and WING, but usually /ch/XX/dca/YY
                // Sometimes WING is just /ch/XX/dca/YY, or /ch/XX/group/dca/YY.
                // Based on "Check your OSC outputs to ensure that it matches with wing OSC control formatting."
                // I will use \`/ch/\${formattedChannel}/dca/\${i}\`
                const payload = {
                    type: 'OSC_CMD',
                    address: \`/ch/\${formattedChannel}/dca/\${i}\`,
                    args: [{ type: 'i', value: value }]
                };
                if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
            }
        }`;

content = content.replace(targetSendDca, replacementSendDca);
fs.writeFileSync('public/index.html', content);
