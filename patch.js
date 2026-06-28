const fs = require('fs');

let content = fs.readFileSync('public/index.html', 'utf8');

// 1. Add dropCharacter function and isEditMode to renderUI
content = content.replace(
    '        function renderUI() {',
    `        function dropCharacter(event, sceneId) {
            event.preventDefault();
            if (!document.body.classList.contains('edit-mode')) return;
            const charId = event.dataTransfer.getData('text/plain');
            if (charId && sceneId) {
                addActorToScene(sceneId, charId);
            }
        }

        function renderUI() {
            const isEditMode = document.body.classList.contains('edit-mode');`
);

// 2. Add drag attributes to bank-item
content = content.replace(
    '                    <div class="bank-item">',
    '                    <div class="bank-item" draggable="${isEditMode ? \'true\' : \'false\'}" ondragstart="event.dataTransfer.setData(\'text/plain\', \'${id}\')">'
);

// 3. Add drop attributes to scene-card
content = content.replace(
    '                    <div class="scene-card ${isActive ? \'active\' : \'\'}">',
    '                    <div class="scene-card ${isActive ? \'active\' : \'\'}" ondragover="event.preventDefault();" ondrop="dropCharacter(event, \'${scene.id}\')">'
);

fs.writeFileSync('public/index.html', content);
