const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');
const CAST_PUBLIC_DIR = path.join(__dirname, '..', 'public', 'assets', 'cast');

// Ensure output directory exists
if (!fs.existsSync(CAST_PUBLIC_DIR)) {
  fs.mkdirSync(CAST_PUBLIC_DIR, { recursive: true });
  console.log('Created /public/assets/cast/');
}

// Exact mapping: HTML filename → DB title
const FILE_TO_TITLE = {
  'Aajo Ardhangini (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Aajo Ardhangini',
  'Baby Do Die Do (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Baby Do Die Do',
  'Cocktail 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Cocktail 2',
  'Deool Band 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Deool Band 2',
  'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Dhamaal 4',
  'Disclosure Day (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Disclosure Day',
  'Evil Dead Burn (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Evil Dead Burn',
  'Ghabadkund (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Ghabadkund',
  'I, Nobody (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'I, Nobody',
  'Idhayam Murali (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Idhayam Murali',
  'Lenin (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Lenin',
  'Mardini (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Mardini',
  'Minions & Monsters (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Minions & Monsters',
  'Mother Promise (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Mother Promise',
  'Nagabandham - The Secret Treasure (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Nagabandham - The Secret Treasure',
  'The Invite (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'The Invite',
  'The Odyssey (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'The Odyssey',
  'The Voice of Hind Rajab (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'The Voice of Hind Rajab',
  'Toy Story 5 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Toy Story 5',
  'Tula Pahta (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Tula Pahta',
  'Tumbadchi Manjula (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Tumbadchi Manjula',
  'Welcome To The Jungle (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Welcome To The Jungle',
};

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function extractCastFromHTML(html, filesDir, title) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  function extractPeople(sectionId) {
    const section = doc.getElementById(sectionId);
    if (!section) return [];
    const links = section.querySelectorAll('a.sc-ar0kx1-0');
    const people = [];

    links.forEach(a => {
      const nameEl = a.querySelector('.sc-ar0kx1-1');
      const roleEl = a.querySelector('.sc-ar0kx1-2');
      const imgEl = a.querySelector('img');
      if (!nameEl) return;

      const name = nameEl.textContent.trim();
      if (!name || name === 'Lead Actor' || name === 'Supporting Actor') return;

      let image = null;
      const imgSrc = imgEl ? (imgEl.getAttribute('src') || '') : '';

      if (imgSrc && imgSrc.includes('bmscdn.com')) {
        // Has online CDN URL - use it directly
        image = imgSrc;
      } else if (imgSrc && !imgSrc.startsWith('http') && imgSrc.endsWith('.jpg')) {
        // Local relative path → check in _files folder
        const localFilename = path.basename(imgSrc);
        const localPath = path.join(filesDir, localFilename);
        if (fs.existsSync(localPath)) {
          // Copy to public/assets/cast/
          const safeName = sanitizeFilename(name);
          const destName = `${safeName}-cast.jpg`;
          const destPath = path.join(CAST_PUBLIC_DIR, destName);
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(localPath, destPath);
          }
          image = `/assets/cast/${destName}`;
          console.log(`    📸 Copied local image: ${name} → ${destName}`);
        }
      }

      people.push({
        name,
        role: roleEl ? roleEl.textContent.replace(/^as\s+/i, '').trim() : 'Actor',
        image,
      });
    });

    return people;
  }

  // Also look for ALL jpg files in the _files directory that look like artist photos
  // Map them by looking at what the HTML img tags reference
  const cast = extractPeople('component-9');
  const crew = extractPeople('component-10');
  return { cast, crew };
}

// Also copy ALL .jpg files from _files that look like artist photos to public/assets/cast
function copyAllArtistImages(filesDir) {
  if (!fs.existsSync(filesDir)) return;
  const files = fs.readdirSync(filesDir);
  files.forEach(f => {
    // Artist images follow patterns like: firstname-lastname-NNNN-date.jpg
    if (f.endsWith('.jpg') && f.match(/^[a-z].*-\d{2,}-.*\.jpg$/)) {
      const src = path.join(filesDir, f);
      const dest = path.join(CAST_PUBLIC_DIR, f);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    }
  });
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const htmlFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.html'));
  let totalCopied = 0;
  let totalUpdated = 0;

  for (const file of htmlFiles) {
    const title = FILE_TO_TITLE[file];
    if (!title) continue;

    const filesDir = path.join(REF_DIR, file.replace('.html', '_files'));
    const htmlPath = path.join(REF_DIR, file);

    if (!fs.existsSync(htmlPath)) continue;

    // Step 1: Copy ALL artist jpgs from _files to public
    const beforeCount = fs.readdirSync(CAST_PUBLIC_DIR).length;
    copyAllArtistImages(filesDir);
    const afterCount = fs.readdirSync(CAST_PUBLIC_DIR).length;
    const newlyCopied = afterCount - beforeCount;
    if (newlyCopied > 0) {
      console.log(`📂 ${title}: copied ${newlyCopied} artist images from _files`);
      totalCopied += newlyCopied;
    }

    // Step 2: Parse HTML to extract cast with correct local image paths
    const html = fs.readFileSync(htmlPath, 'utf8');
    const { cast, crew } = extractCastFromHTML(html, filesDir, title);

    if (!cast.length && !crew.length) continue;

    // Step 3: For each cast member, try to find their image in the copied files
    // Match by checking if any copied jpg filename contains a slug of their name
    const allCastImages = fs.readdirSync(CAST_PUBLIC_DIR).filter(f => f.endsWith('.jpg'));

    const enrichedCast = cast.map(c => {
      if (c.image) return c; // already has image
      // Try fuzzy match: "Ajay Devgn" → look for file containing "ajay"
      const nameParts = c.name.toLowerCase().split(' ').filter(Boolean);
      const firstPart = nameParts[0];
      const match = allCastImages.find(f => f.toLowerCase().startsWith(firstPart));
      if (match) {
        console.log(`    🔗 Matched: ${c.name} → ${match}`);
        return { ...c, image: `/assets/cast/${match}` };
      }
      return c;
    });

    const enrichedCrew = crew.map(c => {
      if (c.image) return c;
      const nameParts = c.name.toLowerCase().split(' ').filter(Boolean);
      const firstPart = nameParts[0];
      const match = allCastImages.find(f => f.toLowerCase().startsWith(firstPart));
      if (match) {
        return { ...c, image: `/assets/cast/${match}` };
      }
      return c;
    });

    const existing = await Movie.findOne({ title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!existing) { console.log(`❌ NOT IN DB: ${title}`); continue; }

    const withImg = enrichedCast.filter(c => c.image).length;
    await Movie.updateOne({ _id: existing._id }, { $set: { cast: enrichedCast, crew: enrichedCrew } });
    console.log(`✅ ${title}: ${enrichedCast.length} cast, ${withImg} with image`);
    totalUpdated++;
  }

  console.log(`\n=== DONE ===`);
  console.log(`Total images copied: ${totalCopied}`);
  console.log(`Total movies updated: ${totalUpdated}`);
  console.log(`Total files in /public/assets/cast/: ${fs.readdirSync(CAST_PUBLIC_DIR).length}`);

  // Final audit
  console.log('\n=== FINAL AUDIT ===');
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  all.sort((a, b) => a.title.localeCompare(b.title));
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const withImg = c.filter(x => x.image).length;
    const icon = withImg === c.length && c.length > 0 ? '🟢' : withImg > 0 ? '🟡' : c.length > 0 ? '🔴' : '⚪';
    console.log(`${icon} ${m.title}: ${c.length} cast, ${withImg} with image`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
