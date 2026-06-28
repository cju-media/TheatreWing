import re

with open('public/index.html', 'r') as f:
    content = f.read()

# Replace bank-item to add draggable
bank_item_pattern = r'''<div class="bank-item">'''
bank_item_repl = r'''<div class="bank-item" draggable="${isEditMode ? 'true' : 'false'}" ondragstart="event.dataTransfer.setData('text/plain', '${id}')">'''
content = content.replace(bank_item_pattern, bank_item_repl)

# Update renderUI to define isEditMode and handle scenesToRender
render_ui_pattern = r'''        function renderUI\(\) \{
            // Render Bank'''
render_ui_repl = r'''        function dropCharacter(event, sceneId) {
            event.preventDefault();
            if (!document.body.classList.contains('edit-mode')) return;
            const charId = event.dataTransfer.getData('text/plain');
            if (charId && sceneId) {
                addActorToScene(sceneId, charId);
            }
        }

        function renderUI() {
            const isEditMode = document.body.classList.contains('edit-mode');
            // Render Bank'''
content = content.replace(render_ui_pattern, render_ui_repl)

scenes_render_pattern = r'''            // Sort scenes numerically so float values \(1\.5\) index perfectly between integers
            state\.scenes\.sort\(\(a, b\) => a\.id - b\.id\);

            state\.scenes\.forEach\(\(scene\) => \{
                const isActive = activeSceneId === scene\.id;'''
scenes_render_repl = r'''            // Sort scenes numerically so float values (1.5) index perfectly between integers
            state.scenes.sort((a, b) => a.id - b.id);

            let scenesToRender = state.scenes;
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

                let sceneLabel = `Act ${scene.id}`;
                if (!isEditMode) {
                    if (scene.id === activeSceneId || (activeSceneId === null && index === 0)) {
                        sceneLabel = `Current (Act ${scene.id})`;
                    } else {
                        sceneLabel = `Next (Act ${scene.id})`;
                    }
                }'''
content = content.replace(scenes_render_pattern, scenes_render_repl)

# Replace the scene card definition
scene_card_pattern = r'''                    <div class="scene-card \$\{isActive \? 'active' : ''\}">
                        <div class="scene-header">
                            <span>Act \$\{scene\.id\}</span>'''
scene_card_repl = r'''                    <div class="scene-card ${isActive ? 'active' : ''}" ondragover="event.preventDefault();" ondrop="dropCharacter(event, '${scene.id}')">
                        <div class="scene-header">
                            <span>${sceneLabel}</span>'''
content = content.replace(scene_card_pattern, scene_card_repl)

# Add keydown event listener at the end
script_end_pattern = r'''        // Boot Init Execution
        renderUI\(\);
    </script>'''
script_end_repl = r'''        // Arrow key navigation
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
    </script>'''
content = content.replace(script_end_pattern, script_end_repl)

with open('public/index.html', 'w') as f:
    f.write(content)
