const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// The titles are inside `<div class="sc-133848s-2 sc-1y4pbdw-12 ..."` or something similar.
// Let's just find all matches of `alt="` and get the titles.
const imgRegex = /<img[^>]*alt="([^"]+)"[^>]*src="([^"]+)"/g;
let movies = [];
let match;
while ((match = imgRegex.exec(html)) !== null) {
  const alt = match[1];
  const src = match[2];
  if (!alt.includes('icon') && !alt.includes('CineVerse') && alt !== 'image') {
    movies.push({ title: alt, poster: src });
  }
}

// deduplicate
const uniqueMovies = Array.from(new Map(movies.map(m => [m.title, m])).values());

console.log(JSON.stringify(uniqueMovies, null, 2));
fs.writeFileSync('scratch/all_titles.json', JSON.stringify(uniqueMovies, null, 2));
