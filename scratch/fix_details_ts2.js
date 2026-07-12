const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/events/[id]/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// Fix TS errors
code = code.replace(/tabindex=/g, 'tabIndex=');

fs.writeFileSync(pageFile, code);
console.log('Fixed tabindex errors in event details page');
