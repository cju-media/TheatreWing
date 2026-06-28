const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// I accidentally replaced the wrong renderUI call previously and didn't remove it correctly. Let's fix this manually using regex.
// Wait, I see two "scrollIntoView" calls. One before addCharacterToBank and one before Arrow key navigation. The latter is correct (inside fireScene). The former is wrong.

content = content.replace(`            // Scroll to the active scene
            setTimeout(() => {
                const activeCard = document.querySelector('.scene-card.active');
                if (activeCard) {
                    activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        }

        function addCharacterToBank() {`, `        }

        function addCharacterToBank() {`);

fs.writeFileSync('public/index.html', content);
