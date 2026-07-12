const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// find the start of the movies section
// we can look for "Filters" or "Movies in"
const filterIndex = html.indexOf('Filters');
const moviesIndex = html.indexOf('Movies in');

console.log("Filter index:", filterIndex);
console.log("Movies index:", moviesIndex);

// Let's grab a chunk of HTML around the filter to see its structure
if (filterIndex > -1) {
  console.log(html.substring(filterIndex - 200, filterIndex + 1000));
}
