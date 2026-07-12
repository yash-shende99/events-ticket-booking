const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/events');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyFiles(sourceDir) {
  if (!fs.existsSync(sourceDir)) return;
  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.gif')) {
      const src = path.join(sourceDir, file);
      const dest = path.join(targetDir, file);
      fs.copyFileSync(src, dest);
    }
  }
}

// Copy from events section_files
copyFiles(path.join(__dirname, '../ref/events section_files'));

// Copy from events_details
const detailsDir = path.join(__dirname, '../ref/events_details');
const detailsItems = fs.readdirSync(detailsDir);
for (const item of detailsItems) {
  const fullPath = path.join(detailsDir, item);
  if (fs.statSync(fullPath).isDirectory() && item.endsWith('_files')) {
    copyFiles(fullPath);
  }
}

console.log('Successfully copied all event images to public/assets/events');
