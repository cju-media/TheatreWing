import re

with open('public/index.html', 'r') as f:
    content = f.read()

# I need to properly replace `function renderUI() {` with the updated one and fix `isEditMode`.
# Looking at the previous run, it seems the script failed to replace properly because my regex was wrong or `content` didn't match.
# Let's do it right.
