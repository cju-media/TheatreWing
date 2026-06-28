const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const targetFireScene = `            renderUI();
        }`;

const replacementFireScene = `            renderUI();

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
