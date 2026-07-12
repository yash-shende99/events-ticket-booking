const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');
const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (nextDataMatch) {
  fs.writeFileSync('scratch/next-data.json', nextDataMatch[1]);
  console.log("Found __NEXT_DATA__");
} else {
  console.log("No __NEXT_DATA__");
}
