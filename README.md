# TheatreWing

TheatreWing is a local theater state engine designed to control scenes, character DCA assignments, and OSC communications with a WING audio mixer.

## Standalone macOS Application

TheatreWing can be built and run as a standalone macOS menu bar application. When running as a standalone app, it operates entirely in the background without opening a terminal window or a dock icon.

### Build Instructions for macOS

1. Ensure you have Node.js installed.
2. Clone this repository and navigate into the project directory.
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Build the macOS application using Electron Builder:
   \`\`\`bash
   npm run build
   \`\`\`
5. Once the build completes, a `.dmg` file will be generated in the \`dist\` folder (which is automatically created by electron-builder).
6. Open the `.dmg` file and drag **TheatreWing.app** to your Applications folder.

### Running the App

1. Launch **TheatreWing** from your Applications folder.
2. An icon (🎭 TheatreWing) will appear in your top macOS menu bar.
3. Click the menu bar icon to reveal the drop-down menu.
4. Click **Open GUI** to automatically open your default web browser to the application interface (\`http://localhost:1476\`).
5. Click **Quit** to shut down the server and exit the application.
