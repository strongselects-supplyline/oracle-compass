const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'public/geo/god-shinobi.html');
const cssPath = path.join(__dirname, 'public/geo/god-shinobi.css');
const jsonPath = path.join(__dirname, 'public/geo/geo-dashboard.json');

let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const json = fs.readFileSync(jsonPath, 'utf8');

// 1. Inject CSS
html = html.replace('<link rel="stylesheet" href="./god-shinobi.css">', `<style>${css}</style>`);

// 2. Inject Data
html = html.replace('<script src="./god-shinobi-data.js"></script>', `<script>window.embeddedData = ${json};</script>`);

fs.writeFileSync(htmlPath, html);
console.log('✅ God-Tier Single-File Created: public/geo/god-shinobi.html');
