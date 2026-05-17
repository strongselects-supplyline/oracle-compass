const fs = require('fs');
let html = fs.readFileSync('LABEL_OS_SOP.html', 'utf-8');
// Strip out CSS and JS
html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
fs.writeFileSync('NotebookLM_Weekly_Bundle/LABEL_OS_SOP_Cleaned.txt', html);
