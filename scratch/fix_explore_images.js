const fs = require('fs');
const path = require('path');

const exploreFile = path.join(__dirname, '../src/components/events/EventsExploreClient.tsx');
let code = fs.readFileSync(exploreFile, 'utf8');

// Replace local file paths from "events section_files/xxx.jpg"
code = code.replace(/src="Top Upcoming Events in Pune _ Best Live Events in Pune - BookMyShow_files\/([^"]+)"/g, 'src="/assets/events/$1"');
code = code.replace(/src="events section_files\/([^"]+)"/g, 'src="/assets/events/$1"');

// Fix any other TS errors we encountered earlier
code = code.replace(/fetchpriority=/g, 'fetchPriority=');
code = code.replace(/ direction="/g, ' data-direction="');
code = code.replace(/<div([^>]*) width="([^"]*)"([^>]*)>/g, '<div$1 data-width="$2"$3>');
code = code.replace(/<div([^>]*) height="([^"]*)"([^>]*)>/g, '<div$1 data-height="$2"$3>');
code = code.replace(/<hr([^>]*) height="([^"]*)"([^>]*)>/g, '<hr$1 data-height="$2"$3>');
code = code.replace(/type="default"/g, 'type="button"');

fs.writeFileSync(exploreFile, code);
console.log('Fixed image paths and TS errors in EventsExploreClient');
