const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Fix scene labeling in play mode
const targetLabelLogic = `                let sceneLabel = \`Act \${scene.id}\`;
                if (!isEditMode) {
                    if (scene.id === activeSceneId || (activeSceneId === null && index === 0)) {
                        sceneLabel = \`Current (Act \${scene.id})\`;
                    } else {
                        sceneLabel = \`Next (Act \${scene.id})\`;
                    }
                }`;

const replacementLabelLogic = `                let sceneLabel = \`Act \${scene.id}\`;
                if (!isEditMode) {
                    if (scene.id === activeSceneId || (activeSceneId === null && index === 0)) {
                        sceneLabel = \`Current (Act \${scene.id})\`;
                    }
                }`;

content = content.replace(targetLabelLogic, replacementLabelLogic);

// Fix dangling DCA state
const targetRemoveActor = `        function removeActorFromScene(sceneId, charId) {
            const scene = state.scenes.find(s => String(s.id) === String(sceneId));
            if(scene) scene.actors = scene.actors.filter(id => id !== charId);
            renderUI();
        }`;

const replacementRemoveActor = `        function removeActorFromScene(sceneId, charId) {
            const scene = state.scenes.find(s => String(s.id) === String(sceneId));
            if(scene) {
                scene.actors = scene.actors.filter(id => id !== charId);
                if (scene.dcas) delete scene.dcas[charId];
            }
            renderUI();
        }`;

content = content.replace(targetRemoveActor, replacementRemoveActor);

fs.writeFileSync('public/index.html', content);
