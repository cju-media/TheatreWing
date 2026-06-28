const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const targetFireScene = `            // Command Loop: Unmute characters inside this scene, Mute any bank characters that aren't
            Object.values(state.characters).forEach(char => {
                if (activeChannels.includes(char.channel)) {
                    sendOscMute(char.channel, false); // Active / Unmuted
                } else {
                    sendOscMute(char.channel, true);  // Muted
                }
            });

            renderUI();
        }`;

const replacementFireScene = `            // Command Loop: Unmute characters inside this scene, Mute any bank characters that aren't
            Object.values(state.characters).forEach(char => {
                if (activeChannels.includes(char.channel)) {
                    sendOscMute(char.channel, false); // Active / Unmuted
                } else {
                    sendOscMute(char.channel, true);  // Muted
                }
            });

            renderUI();

            // Scroll to the active scene
            setTimeout(() => {
                const activeCard = document.querySelector('.scene-card.active');
                if (activeCard) {
                    activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }`;

content = content.replace(targetFireScene, replacementFireScene);
fs.writeFileSync('public/index.html', content);
