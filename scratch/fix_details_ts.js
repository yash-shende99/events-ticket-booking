const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/events/[id]/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// Fix TS errors
code = code.replace(/fetchpriority=/g, 'fetchPriority=');
code = code.replace(/ direction="/g, ' data-direction="');
code = code.replace(/<div([^>]*) width="([^"]*)"([^>]*)>/g, '<div$1 data-width="$2"$3>');
code = code.replace(/<div([^>]*) height="([^"]*)"([^>]*)>/g, '<div$1 data-height="$2"$3>');
code = code.replace(/<hr([^>]*) height="([^"]*)"([^>]*)>/g, '<hr$1 data-height="$2"$3>');
code = code.replace(/type="default"/g, 'type="button"');

fs.writeFileSync(pageFile, code);
console.log('Fixed TS errors in event details page');
