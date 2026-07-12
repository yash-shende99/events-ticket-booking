const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');

// These files weren't matched because their HTML h1 redirected - extract by force using file title
const FILE_TITLE_MAP = {
  'Tula Pahta (2026)': 'Tula Pahta',
  'Evil Dead Burn (2026)': 'Evil Dead Burn',
  'Welcome To The Jungle (2026)': 'Welcome To The Jungle',
  'Spider-Man_ Brand New Day (2026)': 'Spider-Man: Brand New Day',
  'Minions & Monsters (2026)': 'Minions & Monsters',
  'Main Vaapas Aaunga': 'Main Vaapas Aaunga',
  'Nagabandham - The Secret Treasure (2026)': 'Nagabandham - The Secret Treasure',
  'The Invite (2026)': 'The Invite',
  'Lenin (2026)': 'Lenin',
  'I, Nobody (2026)': 'I, Nobody',
  'Obsession': 'Obsession',
  'Deool Band 2 (2026)': 'Deool Band 2',
  'FIFA World Cup 2026 - Argentina Vs Switzerland (2026)': 'FIFA World Cup 2026 - Argentina Vs Switzerland',
  'FIFA World Cup 2026 Quarter Final - Norway Vs England': 'FIFA World Cup 2026 Quarter Final - Norway Vs England',
  'Idhayam Murali (2026)': 'Idhayam Murali',
  'Backrooms (2026)': 'Backrooms',
  'Aajo Ardhangini (2026)': 'Aajo Ardhangini',
  'FIFA World Cup 2026 - France Vs Spain (2026)': 'FIFA World Cup 2026 - France Vs Spain',
  'Dhamaal 4 (2026)': 'Dhamaal 4',
  'Alpha (2026)': 'Alpha',
  'The Odyssey (2026)': 'The Odyssey',
  'Moana (2026)': 'Moana',
};

function getMovieTitleFromFilename(filename) {
  const baseName = filename.replace(/\s*-\s*Movie.*$/i, '').replace(/\s*_\s*Movie.*$/i, '').replace(/\.html$/, '').trim();
  // Try matching from our map
  for (const [key, value] of Object.entries(FILE_TITLE_MAP)) {
    if (baseName.toLowerCase().includes(key.toLowerCase().split('(')[0].trim().toLowerCase())) {
      return value;
    }
  }
  return null;
}

function extractFromHTML(html, forcedTitle) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // About / Synopsis
  let about = null;
  const aboutSection = doc.querySelector('.sc-1hz44by-3');
  if (aboutSection) about = aboutSection.textContent.trim();

  // Hero poster
  let poster = null;
  const heroSection = doc.querySelector('[style*="background-image"]');
  if (heroSection) {
    const styleStr = heroSection.getAttribute('style') || '';
    const match = styleStr.match(/url\("?(https:\/\/assets-in\.bmscdn\.com[^"')]+)"?\)/);
    if (match) poster = match[1];
  }
  
  // Fallback poster: look for img with alt matching forcedTitle
  if (!poster && forcedTitle) {
    const allImgs = doc.querySelectorAll('img');
    for (const img of allImgs) {
      const alt = img.getAttribute('alt') || '';
      const src = img.getAttribute('src') || '';
      if (alt.toLowerCase() === forcedTitle.toLowerCase() && src.includes('bmscdn.com') && src.includes('portrait')) {
        poster = src;
        break;
      }
    }
    // Second fallback: any bmscdn iedb movie image
    if (!poster) {
      for (const img of allImgs) {
        const src = img.getAttribute('src') || '';
        if (src.includes('bmscdn.com/iedb/movies') && src.includes('portrait')) {
          poster = src;
          break;
        }
      }
    }
  }

  // Meta info
  let duration = '', genres = [], certification = '', languages = [], formats = [];
  const metaDivs = doc.querySelectorAll('.sc-ay3jka-1');
  if (metaDivs.length > 0) {
    const firstMeta = metaDivs[0];
    const allTexts = firstMeta.textContent;
    const durMatch = allTexts.match(/(\d+h\s*\d*m?|\d+m)/);
    if (durMatch) duration = durMatch[0].trim();
    const certMatch = allTexts.match(/[\s•]+([UA]+\d*[+]?)\s*$/);
    if (certMatch) certification = certMatch[1].trim();
    const genreLinks = firstMeta.querySelectorAll('a');
    genreLinks.forEach(a => {
      const g = a.textContent.trim();
      if (g) genres.push(g);
    });
  }
  if (metaDivs.length > 1) {
    const secondMeta = metaDivs[1];
    const formatDivs = secondMeta.querySelectorAll('.sc-ay3jka-4');
    if (formatDivs.length > 0) {
      formatDivs[0].querySelectorAll('a').forEach(a => formats.push(a.textContent.trim()));
    }
    if (formatDivs.length > 1) {
      formatDivs[1].querySelectorAll('a').forEach(a => languages.push(a.textContent.trim()));
    }
  }

  // Release Date
  let releaseDate = '';
  const releasingEl = doc.querySelector('.sc-ngkhws-5 span, .sc-ngkhws-4');
  if (releasingEl) {
    releaseDate = releasingEl.textContent.replace(/releasing on/i, '').replace(/\u00a0/g, '').trim();
  }

  // Cast
  const cast = [];
  const castSection = doc.getElementById('component-9');
  if (castSection) {
    const castLinks = castSection.querySelectorAll('a.sc-ar0kx1-0');
    castLinks.forEach(a => {
      const nameEl = a.querySelector('.sc-ar0kx1-1');
      const roleEl = a.querySelector('.sc-ar0kx1-2');
      const imgEl = a.querySelector('img');
      if (nameEl && nameEl.textContent.trim()) {
        const imgSrc = imgEl ? imgEl.getAttribute('src') : null;
        cast.push({
          name: nameEl.textContent.trim(),
          role: roleEl ? roleEl.textContent.replace(/^as\s+/i, '').trim() : 'Actor',
          image: imgSrc && imgSrc.includes('bmscdn.com') ? imgSrc : null
        });
      }
    });
  }

  // Crew
  const crew = [];
  const crewSection = doc.getElementById('component-10');
  if (crewSection) {
    const crewLinks = crewSection.querySelectorAll('a.sc-ar0kx1-0');
    crewLinks.forEach(a => {
      const nameEl = a.querySelector('.sc-ar0kx1-1');
      const roleEl = a.querySelector('.sc-ar0kx1-2');
      const imgEl = a.querySelector('img');
      if (nameEl && nameEl.textContent.trim()) {
        const imgSrc = imgEl ? imgEl.getAttribute('src') : null;
        crew.push({
          name: nameEl.textContent.trim(),
          role: roleEl ? roleEl.textContent.trim() : '',
          image: imgSrc && imgSrc.includes('bmscdn.com') ? imgSrc : null
        });
      }
    });
  }

  // Votes/interested
  let votes = '';
  const intEl = doc.querySelector('.sc-1qdowf4-0');
  if (intEl) {
    const txt = intEl.textContent.trim();
    const m = txt.match(/([\d.]+[KMk]?\+?)\s+are interested/i);
    if (m) votes = m[1] + '+ Likes';
  }

  return { about, poster, duration, genres, certification, languages, formats, releaseDate, cast, crew, votes };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const allFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.html'));

  for (const file of allFiles) {
    const movieTitle = getMovieTitleFromFilename(file);
    if (!movieTitle) {
      console.log(`SKIP (no title map): ${file}`);
      continue;
    }

    const existing = await Movie.findOne({ title: new RegExp('^' + movieTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (!existing) {
      console.log(`NOT IN DB: ${movieTitle}`);
      continue;
    }

    // Only update if cast is missing
    const hasCast = (existing.cast || []).filter(c => c.name && c.name !== 'Lead Actor' && c.name !== 'Supporting Actor').length > 0;
    
    const html = fs.readFileSync(path.join(REF_DIR, file), 'utf8');
    const data = extractFromHTML(html, movieTitle);

    const updateData = {};
    if (data.about && (!existing.about || existing.about.includes('Experience the magic'))) updateData.about = data.about;
    if (data.duration) updateData.duration = data.duration;
    if (data.genres && data.genres.length > 0 && !data.genres.some(g => g.length < 2)) updateData.genres = data.genres;
    if (data.certification && data.certification.length <= 5) updateData.certification = data.certification;
    if (data.languages && data.languages.length > 0) updateData.languages = data.languages;
    if (data.formats && data.formats.length > 0) updateData.formats = data.formats;
    if (data.releaseDate) updateData.releaseDate = data.releaseDate;
    if (data.cast && data.cast.length > 0 && !hasCast) updateData.cast = data.cast;
    if (data.crew && data.crew.length > 0 && (!existing.crew || existing.crew.length === 0)) updateData.crew = data.crew;
    if (data.poster && (!existing.poster || !existing.poster.startsWith('/assets/'))) updateData.poster = data.poster;

    if (Object.keys(updateData).length > 0) {
      await Movie.updateOne({ _id: existing._id }, { $set: updateData });
      console.log(`✅ UPDATED: ${movieTitle} | cast:${data.cast.length} | crew:${data.crew.length} | genres:${data.genres.join(',')} | dur:${data.duration}`);
    } else {
      console.log(`⏭ SKIP (already complete): ${movieTitle}`);
    }
  }

  console.log('\n=== FINAL AUDIT ===');
  const movies = await Movie.find({}, { title: 1, about: 1, cast: 1, duration: 1, genres: 1, languages: 1, formats: 1 }).lean();
  movies.forEach(m => {
    const cast = (m.cast || []).filter(c => c.name && c.name !== 'Lead Actor');
    console.log(`${m.title} | dur:${m.duration || '?'} | cast:${cast.length} | genres:${(m.genres || []).join(',')} | lang:${(m.languages || []).join(',')}`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
