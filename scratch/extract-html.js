const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// extract all <style> tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let styles = '';
let match;
while ((match = styleRegex.exec(html)) !== null) {
  styles += match[0] + '\n';
}

// extract body inner HTML
const bodyStart = html.indexOf('<body');
const bodyStartEnd = html.indexOf('>', bodyStart) + 1;
const bodyEnd = html.lastIndexOf('</body>');

let bodyHtml = '';
if (bodyStart !== -1 && bodyEnd !== -1) {
  bodyHtml = html.substring(bodyStartEnd, bodyEnd);
}

// We will save a clean version to use in our component
fs.writeFileSync('scratch/movies-raw.html', styles + '\n' + bodyHtml);
console.log('Saved to scratch/movies-raw.html');
