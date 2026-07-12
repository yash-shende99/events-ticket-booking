const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');

// Exact mapping: filename prefix → DB movie title
const FILE_TO_TITLE = {
  'Aajo Ardhangini (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html': 'Aajo Ardhangini',
  'Alpha (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Alpha',
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
  'Moana (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow.html': 'Moana',
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

function extractCastCrewFromHTML(html) {
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
      const src = imgEl ? imgEl.getAttribute('src') : null;
      // Only keep valid bmscdn image URLs
      const image = src && src.includes('bmscdn.com') && src.includes('/artist/') ? src : null;
      people.push({
        name,
        role: roleEl ? roleEl.textContent.replace(/^as\s+/i, '').trim() : 'Actor',
        image,
      });
    });
    return people;
  }

  const cast = extractPeople('component-9');
  const crew = extractPeople('component-10');

  // Also extract release date and duration from hero
  let duration = '';
  let releaseDate = '';
  let about = '';

  const metaDivs = doc.querySelectorAll('.sc-ay3jka-1');
  if (metaDivs[0]) {
    const txt = metaDivs[0].textContent;
    const dur = txt.match(/(\d+h\s*\d*m|\d+m)/);
    if (dur) duration = dur[0].trim();
  }
  const relEl = doc.querySelector('.sc-ngkhws-4, .sc-ngkhws-5 span');
  if (relEl) releaseDate = relEl.textContent.replace(/releasing on/gi, '').replace(/\u00a0/g, '').trim();

  const aboutEl = doc.querySelector('.sc-1hz44by-3 span');
  if (aboutEl) about = aboutEl.textContent.trim();

  return { cast, crew, duration, releaseDate, about };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const htmlFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.html'));
  
  let successCount = 0;
  let skipCount = 0;

  for (const file of htmlFiles) {
    const title = FILE_TO_TITLE[file];
    if (!title) {
      console.log(`⏭  SKIP (no mapping): ${file}`);
      skipCount++;
      continue;
    }

    const existing = await Movie.findOne({ title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!existing) {
      console.log(`❌ NOT IN DB: ${title}`);
      skipCount++;
      continue;
    }

    const html = fs.readFileSync(path.join(REF_DIR, file), 'utf8');
    const { cast, crew, duration, releaseDate, about } = extractCastCrewFromHTML(html);

    const castWithImg = cast.filter(c => c.image).length;
    const castNoImg = cast.filter(c => !c.image).length;

    console.log(`📽  ${title}`);
    console.log(`    Cast: ${cast.length} (${castWithImg} with image, ${castNoImg} without)`);
    if (crew.length) console.log(`    Crew: ${crew.length}`);
    cast.forEach(c => console.log(`      - ${c.name} [${c.role}] ${c.image ? '✅' : '⬜'}`));

    // Build update — only override cast/crew if we got better data from this HTML
    const update = {};
    if (cast.length > 0) update.cast = cast;
    if (crew.length > 0) update.crew = crew;
    if (duration) update.duration = duration;
    if (about && (!existing.about || existing.about.length < about.length)) update.about = about;
    if (releaseDate) update.releaseDate = releaseDate;

    if (Object.keys(update).length > 0) {
      await Movie.updateOne({ _id: existing._id }, { $set: update });
      console.log(`    ✅ Updated DB\n`);
      successCount++;
    } else {
      console.log(`    ⏭  Nothing new to update\n`);
    }
  }

  console.log(`\n=== DONE: Updated ${successCount}, Skipped ${skipCount} ===`);

  // Final audit
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  console.log('\n=== CAST AUDIT ===');
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const withImg = c.filter(x => x.image).length;
    console.log(`${m.title}: ${c.length} cast, ${withImg} with image`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
