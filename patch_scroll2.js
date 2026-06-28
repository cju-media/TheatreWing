const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// I accidentally replaced the wrong renderUI() call. I need to make sure I am replacing the one inside fireScene().

// Let's reset public/index.html
