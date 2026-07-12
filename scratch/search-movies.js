const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// The screenshot shows movies. I will search for words like "Dhamaal 4", "Moana", "Alpha" and see if there are other movies listed.
// A common structure for bookmyshow titles in the HTML: 
// <div class="sc-133848s-2 sc-1y4pbdw-12 irZrCs jhFBqU"><a href="/movies/dhamaal-4/ET00452553">...

const matches = html.match(/href="\/movies\/[^\/]+\/ET[0-9]+"/g);
if (matches) {
  const uniqueUrls = Array.from(new Set(matches));
  console.log("Movie URLs found:", uniqueUrls);
} else {
  console.log("No movies found");
}

// Let's also check for any alt texts in imgs
const altMatches = html.match(/alt="([^"]+)"/g);
if (altMatches) {
  const uniqueAlts = Array.from(new Set(altMatches)).slice(0, 50);
  console.log("Unique Alts:", uniqueAlts);
}
