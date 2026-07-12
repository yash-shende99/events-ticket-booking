const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/events/[id]/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// Replace local file paths like "PRACTICE - A Standup Comedy Show by Manik Mahna Comedy Shows Event Tickets - BookMyShow_files/xxx.jpg"
// with "/assets/events/xxx.jpg"
code = code.replace(/src="PRACTICE[^"]*\/([^"]+)"/g, 'src="/assets/events/$1"');
// Replace any other relative ones just in case
code = code.replace(/src="([^"]+\.jpg)"/g, (match, p1) => {
    if (p1.startsWith('http') || p1.startsWith('/')) return match;
    const parts = p1.split('/');
    return `src="/assets/events/${parts[parts.length - 1]}"`;
});

// Since we are mocking the UI exactly, let's inject dynamic data where it makes sense, but keep the fallback exactly like the reference HTML.
// In the event details, there's usually a title.
code = code.replace(/PRACTICE - A Standup Comedy Show by Manik Mahna/g, '{event ? event.title : "PRACTICE - A Standup Comedy Show by Manik Mahna"}');
// And price
code = code.replace(/₹ 499/g, '{event ? (event.price || "₹ 499") : "₹ 499"}');

fs.writeFileSync(pageFile, code);
console.log('Fixed image paths and added basic dynamic data in event details page');
