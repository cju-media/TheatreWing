const { app, Tray, Menu, shell, nativeImage } = require('electron');
const path = require('path');

// Prevent a dock icon from showing
app.dock.hide();

let tray = null;

app.on('ready', () => {
    // Start the local server
    require('./server.js');

    // Create an empty native image for the tray icon (or load a real one if available)
    // A simple text/character can also act as a tray icon if no image is available.
    // We will use a generic empty image or a default icon.
    // For macOS, usually a 16x16 png is used. We'll use a native image fallback.
    const icon = nativeImage.createEmpty();
    tray = new Tray(icon);
    tray.setTitle('🎭 TheatreWing');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open GUI',
            click: () => {
                shell.openExternal('http://localhost:1476');
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('TheatreWing Server');
    tray.setContextMenu(contextMenu);
});
