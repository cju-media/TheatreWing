const fs = require('fs');

// We need to update the frontend to support DCA assignments
// First, update the state structure slightly (characters are assigned DCAs per scene)
// But actually, it says: "Allow DCA assignments to change for each scene too. Display the character's DCA assignment. Do not change the DCA assignment between scenes even if a character is not in that scene. Only change DCA assignments when the user changes them in a scene"

// That means a character's DCA assignment is stateful globally, OR it is per scene?
// Wait, "Do not change the DCA assignment between scenes even if a character is not in that scene. Only change DCA assignments when the user changes them in a scene"
// This means the mixer's DCA assignment for a character shouldn't be altered when switching scenes UNLESS the scene specifically dictates a change.
// So a Scene can optionally override a character's DCA.
