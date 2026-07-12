const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// Find the first instance of 'Dhamaal 4' (from the screenshot) to see its HTML block
const dhamaalIndex = html.indexOf('Dhamaal 4');
if (dhamaalIndex !== -1) {
  console.log(html.substring(dhamaalIndex - 500, dhamaalIndex + 500));
} else {
  console.log("Dhamaal 4 not found");
}
