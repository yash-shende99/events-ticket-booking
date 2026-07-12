const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/events/[id]/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');
code = code.replace(/tabIndex="0"/g, 'tabIndex={0}');
code = code.replace(/tabIndex="-1"/g, 'tabIndex={-1}');
fs.writeFileSync(pageFile, code);

const exploreFile = path.join(__dirname, '../src/components/events/EventsExploreClient.tsx');
if (fs.existsSync(exploreFile)) {
    let exploreCode = fs.readFileSync(exploreFile, 'utf8');
    exploreCode = exploreCode.replace(/tabIndex="0"/g, 'tabIndex={0}');
    exploreCode = exploreCode.replace(/tabIndex="-1"/g, 'tabIndex={-1}');
    fs.writeFileSync(exploreFile, exploreCode);
}

console.log('Fixed tabIndex type errors');
