const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const target = `        // Boot Init Execution
        renderUI();
    </script>`;

const replacement = `        // Arrow key navigation
        window.addEventListener('keydown', (e) => {
            const isEditMode = document.body.classList.contains('edit-mode');
            if (isEditMode) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            state.scenes.sort((a, b) => a.id - b.id);
            let currentIndex = state.scenes.findIndex(s => s.id === activeSceneId);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (currentIndex === -1) {
                    if (state.scenes.length > 0) fireScene(state.scenes[0].id);
                } else if (currentIndex < state.scenes.length - 1) {
                    fireScene(state.scenes[currentIndex + 1].id);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (currentIndex > 0) {
                    fireScene(state.scenes[currentIndex - 1].id);
                }
            }
        });

        // Boot Init Execution
        renderUI();
    </script>`;

content = content.replace(target, replacement);
fs.writeFileSync('public/index.html', content);
