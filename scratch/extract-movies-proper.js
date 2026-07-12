const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// The movie cards have this structure in BookMyShow:
// <div class="sc-133848s-3 ..."><a href="/movies/..."><div class="...">...<img alt="Movie Title" src="...">...</div><div ...>Title</div><div ...>Certificate/Language</div><div ...>Genre</div>...</a></div>

// Let's use regex to find all <a href="/movies/..."> blocks and parse them.
const movieBlocksRegex = /<a href="\/movies\/[^>]*>([\s\S]*?)<\/a>/g;
let movies = [];
let match;
while ((match = movieBlocksRegex.exec(html)) !== null) {
  const block = match[1];
  
  // Extract title (usually inside a div with class sc-133848s-1 or similar, or from img alt)
  const imgMatch = /<img[^>]*alt="([^"]+)"[^>]*src="([^"]+)"/g.exec(block);
  if (!imgMatch) continue;
  
  const title = imgMatch[1];
  const poster = imgMatch[2];
  
  // To get language/format, we can look for U/A or similar certification
  const certMatch = /<div class="[^"]*">([^<]+)<\/div>/g;
  let textNodes = [];
  let tMatch;
  while ((tMatch = certMatch.exec(block)) !== null) {
    textNodes.push(tMatch[1]);
  }
  
  // Usually the structure is: [Rating, Votes, Title, Cert/Lang, Genre]
  movies.push({
    title,
    poster,
    texts: textNodes
  });
}

const uniqueMovies = Array.from(new Map(movies.map(m => [m.title, m])).values());

console.log(`Found ${uniqueMovies.length} movies.`);
fs.writeFileSync('scratch/extracted_movies.json', JSON.stringify(uniqueMovies, null, 2));
