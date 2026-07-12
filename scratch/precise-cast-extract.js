const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');
const CAST_DIR = path.join(__dirname, '..', 'public', 'assets', 'cast');

const FILE_TO_TITLE = {
  'Aajo Ardhangini (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Aajo Ardhangini',
  'Baby Do Die Do (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Baby Do Die Do',
  'Cocktail 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Cocktail 2',
  'Deool Band 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Deool Band 2',
  'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Dhamaal 4',
  'Disclosure Day (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Disclosure Day',
  'Evil Dead Burn (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Evil Dead Burn',
  'Ghabadkund (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Ghabadkund',
  'Gatta Kusthi 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Gatta Kusthi 2',
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

function resolveLocalImage(imgSrc, filesDir) {
  if (!imgSrc) return null;

  // Case 1: already a bmscdn.com URL
  if (imgSrc.includes('bmscdn.com')) return imgSrc;

  // Case 2: relative path like "./Dhamaal 4_files/ajay-devgn.jpg" or just "ajay-devgn.jpg"
  const basename = path.basename(imgSrc.split('?')[0]);
  if (!basename.endsWith('.jpg') && !basename.endsWith('.png')) return null;

  // Check if it's in _files directory
  const inFiles = path.join(filesDir, basename);
  if (fs.existsSync(inFiles)) {
    // Copy to public/assets/cast if not already there
    const dest = path.join(CAST_DIR, basename);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(inFiles, dest);
    }
    return `/assets/cast/${basename}`;
  }

  // Check if already copied to cast dir
  const inCast = path.join(CAST_DIR, basename);
  if (fs.existsSync(inCast)) {
    return `/assets/cast/${basename}`;
  }

  return null;
}

function extractPeople(doc, sectionId, filesDir) {
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

    const rawSrc = imgEl ? (imgEl.getAttribute('src') || '') : '';
    const image = resolveLocalImage(rawSrc, filesDir);

    people.push({
      name,
      role: roleEl ? roleEl.textContent.replace(/^as\s+/i, '').trim() : 'Actor',
      image,
    });
  });

  return people;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const htmlFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.html'));
  let totalMoviesFixed = 0;

  for (const file of htmlFiles) {
    const title = FILE_TO_TITLE[file];
    if (!title) continue;

    const htmlPath = path.join(REF_DIR, file);
    const filesDir = path.join(REF_DIR, file.replace('.html', '_files'));

    if (!fs.existsSync(htmlPath)) continue;

    const existing = await Movie.findOne({ title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!existing) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const cast = extractPeople(doc, 'component-9', filesDir);
    const crew = extractPeople(doc, 'component-10', filesDir);

    if (!cast.length && !crew.length) {
      console.log(`⏭  ${title}: no cast/crew in HTML`);
      continue;
    }

    const withImg = cast.filter(c => c.image).length;
    const update = {};
    if (cast.length) update.cast = cast;
    if (crew.length) update.crew = crew;

    await Movie.updateOne({ _id: existing._id }, { $set: update });
    const icon = withImg === cast.length ? '🟢' : withImg > 0 ? '🟡' : '🔴';
    console.log(`${icon} ${title}: ${cast.length} cast, ${withImg}/${cast.length} images`);
    cast.forEach(c => {
      const img = c.image ? (c.image.startsWith('/') ? c.image : '(CDN)') : '❌';
      console.log(`   ${c.image ? '✅' : '⬜'} ${c.name} → ${img}`);
    });
    totalMoviesFixed++;
  }

  console.log(`\n✅ Fixed ${totalMoviesFixed} movies\n`);

  // Final clean audit
  console.log('=== FINAL AUDIT ===');
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  all.sort((a, b) => a.title.localeCompare(b.title));
  let totalCast = 0, totalWithImg = 0;
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const wi = c.filter(x => x.image).length;
    totalCast += c.length;
    totalWithImg += wi;
    const icon = wi === c.length && c.length > 0 ? '🟢' : wi > 0 ? '🟡' : c.length > 0 ? '🔴' : '⚪';
    console.log(`${icon} ${m.title}: ${c.length} cast, ${wi} with image`);
  });
  console.log(`\nOverall: ${totalWithImg}/${totalCast} cast members have images`);

  await mongoose.disconnect();
}

main().catch(console.error);
