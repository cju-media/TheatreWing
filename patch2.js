const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Replace the loop for scenes
const scenesLoopTarget = `            state.scenes.forEach(scene => {
                const isActive = activeSceneId === scene.id;
                let actorRows = '';`;

const scenesLoopReplacement = `            let scenesToRender = state.scenes;
            if (!isEditMode) {
                let currentIndex = state.scenes.findIndex(s => s.id === activeSceneId);
                if (currentIndex === -1) currentIndex = 0;
                const currentScene = state.scenes[currentIndex];
                const nextScene = state.scenes[currentIndex + 1];
                scenesToRender = [];
                if (currentScene) scenesToRender.push(currentScene);
                if (nextScene) scenesToRender.push(nextScene);
            }

            scenesToRender.forEach((scene, index) => {
                const isActive = activeSceneId === scene.id;

                let sceneLabel = \`Act \${scene.id}\`;
                if (!isEditMode) {
                    if (scene.id === activeSceneId || (activeSceneId === null && index === 0)) {
                        sceneLabel = \`Current (Act \${scene.id})\`;
                    } else {
                        sceneLabel = \`Next (Act \${scene.id})\`;
                    }
                }

                let actorRows = '';`;

content = content.replace(scenesLoopTarget, scenesLoopReplacement);

const sceneHeaderTarget = `                        <div class="scene-header">
                            <span>Act \${scene.id}</span>`;

const sceneHeaderReplacement = `                        <div class="scene-header">
                            <span>\${sceneLabel}</span>`;

content = content.replace(sceneHeaderTarget, sceneHeaderReplacement);

fs.writeFileSync('public/index.html', content);
