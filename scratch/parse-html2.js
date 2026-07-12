const fs = require('fs');
const html = fs.readFileSync('ref/movies section.html', 'utf8');

const headStart = html.indexOf('<head>');
const headEnd = html.indexOf('</head>');
const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');

console.log('Has head:', headStart !== -1);
if (headStart !== -1) {
  console.log('Head length:', headEnd - headStart);
}

console.log('Has body:', bodyStart !== -1);
if (bodyStart !== -1) {
  console.log('Body start snippet:', html.substring(bodyStart, bodyStart + 100));
}
