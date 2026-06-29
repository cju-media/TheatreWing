const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

const targetRender = `            let scenesToRender = state.scenes;
            if (!isEditMode) {
                let currentIndex = state.scenes.findIndex(s => s.id === activeSceneId);
                if (currentIndex === -1) currentIndex = 0;
                const currentScene = state.scenes[currentIndex];
                const nextScene = state.scenes[currentIndex + 1];
                scenesToRender = [];
                if (currentScene) scenesToRender.push(currentScene);
                if (nextScene) scenesToRender.push(nextScene);
            }`;

const replacementRender = `            let scenesToRender = state.scenes;`;

content = content.replace(targetRender, replacementRender);
fs.writeFileSync('public/index.html', content);
