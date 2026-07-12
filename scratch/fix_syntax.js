const fs = require('fs');
let code = fs.readFileSync('src/components/events/EventsExploreClient.tsx', 'utf8');

// The file currently has:
// const FilterSection = ...
// export default function EventsExploreClient({ initialEvents }: { initialEvents: any[] }) {
//     <div id="super-wrapper" ...

// Extract FilterSection
const filterSectionStart = code.indexOf('const FilterSection = ({');
const filterSectionEnd = code.indexOf('export default function EventsExploreClient', filterSectionStart);
const filterSectionCode = code.substring(filterSectionStart, filterSectionEnd);

// Remove FilterSection from inside the component
code = code.substring(0, filterSectionStart) + code.substring(filterSectionEnd);

// Fix the missing return( before <div id="super-wrapper"
code = code.replace('export default function EventsExploreClient({ initialEvents }: { initialEvents: any[] }) {\r\n    <div id="super-wrapper"', '  return (\r\n    <div id="super-wrapper"');
code = code.replace('export default function EventsExploreClient({ initialEvents }: { initialEvents: any[] }) {\n    <div id="super-wrapper"', '  return (\n    <div id="super-wrapper"');

// Insert FilterSection before the first export default function
const exportStart = code.indexOf('export default function EventsExploreClient');
code = code.substring(0, exportStart) + filterSectionCode + '\n' + code.substring(exportStart);

fs.writeFileSync('src/components/events/EventsExploreClient.tsx', code);
console.log('Fixed syntax!');
