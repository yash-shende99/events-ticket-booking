const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');

function extractAbout(doc) {
  const aboutSection = doc.querySelector('section > h2[class*="sc-"]')?.parentElement;
  if (!aboutSection) return '';
  const textEl = aboutSection.querySelector('div > span');
  return textEl ? textEl.textContent.trim() : '';
}

function resolveLocalImage(imgSrc) {
  if (!imgSrc) return null;
  if (imgSrc.includes('bmscdn.com')) return imgSrc;
  const basename = path.basename(imgSrc.split('?')[0]);
  if (!basename.endsWith('.jpg') && !basename.endsWith('.png')) return null;
  const castPath = path.join(__dirname, '..', 'public', 'assets', 'cast', basename);
  if (fs.existsSync(castPath)) {
    return `/assets/cast/${basename}`;
  }
  return null;
}

function extractPeople(doc, sectionId) {
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
    const image = resolveLocalImage(rawSrc);

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
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const files = [
    { title: 'Obsession', file: 'Watch Obsession Movie Online _ Buy Rent Obsession On BMS Stream.html' },
    { title: 'Main Vaapas Aaunga', file: 'Main Vaapas Aaunga (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow.html' }
  ];

  for (const { title, file } of files) {
    const htmlPath = path.join(REF_DIR, file);
    if (!fs.existsSync(htmlPath)) {
        console.log(`❌ Missing HTML for ${title}`);
        continue;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const about = extractAbout(doc);
    const cast = extractPeople(doc, 'component-9');
    const crew = extractPeople(doc, 'component-10');

    await Movie.updateOne(
      { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      { $set: { about, cast, crew } }
    );
    console.log(`✅ Restored info for ${title} (Cast: ${cast.length}, Crew: ${crew.length})`);
  }

  process.exit(0);
}

main().catch(console.error);
