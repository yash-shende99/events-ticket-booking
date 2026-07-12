const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// extract the style tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let styles = '';
let match;
while ((match = styleRegex.exec(html)) !== null) {
  styles += match[1] + '\n';
}
fs.writeFileSync('scratch/extracted-styles.css', styles);

// try to extract the filter sidebar HTML block
// the sidebar usually has "Filters" as a title
const filterIndex = html.indexOf('Filters');
if (filterIndex > -1) {
  // Let's grab the container div
  fs.writeFileSync('scratch/filter-snippet.html', html.substring(filterIndex - 300, filterIndex + 2000));
}

// extract a movie card HTML block
const movieIndex = html.indexOf('/movies/dhamaal-4'); // wait, the html doesn't have dhamaal 4, it has events
const eventIndex = html.indexOf('Inder Sahani Live');
if (eventIndex > -1) {
  fs.writeFileSync('scratch/movie-snippet.html', html.substring(eventIndex - 1000, eventIndex + 1000));
}
