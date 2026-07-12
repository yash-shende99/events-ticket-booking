const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');
const HTML_FILES = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.html'));

function extractMovieData(htmlContent, filename) {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Title - from h1
  const titleEl = doc.querySelector('h1');
  const title = titleEl ? titleEl.textContent.trim() : null;
  if (!title) return null;

  // Poster - from the big hero background image URL or img with movie alt text
  let poster = null;
  const heroSection = doc.querySelector('[style*="background-image"]');
  if (heroSection) {
    const styleStr = heroSection.getAttribute('style') || '';
    const match = styleStr.match(/url\("?(https:\/\/assets-in\.bmscdn\.com[^"')]+)"?\)/);
    if (match) poster = match[1];
  }
  if (!poster) {
    const mainImg = doc.querySelector('img[alt="' + title + '"]');
    if (mainImg) poster = mainImg.getAttribute('src');
  }

  // About / Synopsis
  let about = null;
  const aboutSection = doc.querySelector('.sc-1hz44by-3');
  if (aboutSection) about = aboutSection.textContent.trim();

  // Meta info: duration, genres, certification, languages, formats
  let duration = '', genres = [], certification = '', languages = [], formats = [];
  const metaDivs = doc.querySelectorAll('.sc-ay3jka-1');
  if (metaDivs.length > 0) {
    // First metaDiv: duration • genre1, genre2 • certification
    const firstMeta = metaDivs[0];
    const allTexts = firstMeta.textContent;
    // Duration: e.g. "2h 55m"
    const durMatch = allTexts.match(/(\d+h\s*\d*m?|\d+m)/);
    if (durMatch) duration = durMatch[0].trim();
    // Certification: "A" or "UA" or "U"
    const certMatch = allTexts.match(/\s+([UA]+\d*[+]?)\s*$/);
    if (certMatch) certification = certMatch[1].trim();
    // Genres: anchor tags inside first meta
    const genreLinks = firstMeta.querySelectorAll('a[href*="movies"]');
    genreLinks.forEach(a => {
      const g = a.textContent.trim();
      if (g && !formats.includes(g) && !languages.includes(g)) genres.push(g);
    });
  }
  if (metaDivs.length > 1) {
    // Second metaDiv: formats  
    const secondMeta = metaDivs[1];
    const formatDivs = secondMeta.querySelectorAll('.sc-ay3jka-4');
    if (formatDivs.length > 0) {
      formatDivs[0].querySelectorAll('a').forEach(a => formats.push(a.textContent.trim()));
    }
    if (formatDivs.length > 1) {
      formatDivs[1].querySelectorAll('a').forEach(a => languages.push(a.textContent.trim()));
    }
    // include "+N" if present
    formatDivs[0] && formatDivs[0].querySelectorAll('.sc-ay3jka-7').forEach(s => {
      const n = parseInt(s.textContent.replace('+', ''));
      if (!isNaN(n)) {
        // Extra formats beyond what's shown - we can just note "+N"
      }
    });
  }

  // Release Date
  let releaseDate = '';
  const releasingEl = doc.querySelector('.sc-ngkhws-5 span');
  if (releasingEl) {
    releaseDate = releasingEl.textContent.replace(/releasing on/i, '').trim();
  } else {
    // Try to find "Oct 24, 2026" type patterns
    const allText = doc.body ? doc.body.textContent : '';
    const dateMatch = allText.match(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[,\s]+\d{4})/i);
    if (dateMatch) releaseDate = dateMatch[1];
  }

  // Cast - from .sc-ar0kx1-0 elements (inside component-9)
  const cast = [];
  const castSection = doc.getElementById('component-9');
  if (castSection) {
    const castLinks = castSection.querySelectorAll('a.sc-ar0kx1-0');
    castLinks.forEach(a => {
      const nameEl = a.querySelector('.sc-ar0kx1-1');
      const roleEl = a.querySelector('.sc-ar0kx1-2');
      const imgEl = a.querySelector('img');
      if (nameEl) {
        cast.push({
          name: nameEl.textContent.trim(),
          role: roleEl ? roleEl.textContent.replace(/^as\s+/i, '').trim() : 'Actor',
          image: imgEl ? imgEl.getAttribute('src') : null
        });
      }
    });
  }

  // Crew - from component-10
  const crew = [];
  const crewSection = doc.getElementById('component-10');
  if (crewSection) {
    const crewLinks = crewSection.querySelectorAll('a.sc-ar0kx1-0');
    crewLinks.forEach(a => {
      const nameEl = a.querySelector('.sc-ar0kx1-1');
      const roleEl = a.querySelector('.sc-ar0kx1-2');
      const imgEl = a.querySelector('img');
      if (nameEl) {
        crew.push({
          name: nameEl.textContent.trim(),
          role: roleEl ? roleEl.textContent.trim() : '',
          image: imgEl ? imgEl.getAttribute('src') : null
        });
      }
    });
  }

  // Rating & Votes - from likes section (BMS doesn't show numeric rating on this page directly)
  // We'll extract from "interested" text if available
  let rating = '8.0';
  let votes = '0 Votes';
  const interestedEl = doc.querySelector('.sc-1qdowf4-0');
  if (interestedEl) {
    const txt = interestedEl.textContent.trim();
    const numMatch = txt.match(/([\d.]+[KM]?\+?)\s+are interested/i);
    if (numMatch) votes = numMatch[1] + ' Votes';
  }

  return {
    title,
    poster,
    about,
    duration,
    genres: genres.length ? genres : ['Drama'],
    certification: certification || 'UA',
    languages: languages.length ? languages : ['Hindi'],
    formats: formats.length ? formats : ['2D'],
    releaseDate,
    cast,
    crew,
    rating,
    votes
  };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const MovieSchema = new mongoose.Schema({
    title: String,
    poster: String,
    about: String,
    duration: String,
    genres: [String],
    certification: String,
    languages: [String],
    formats: [String],
    releaseDate: String,
    cast: [{ name: String, role: String, image: String }],
    crew: [{ name: String, role: String, image: String }],
    rating: String,
    votes: String,
  }, { strict: false });
  
  const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

  const results = [];
  for (const file of HTML_FILES) {
    const filePath = path.join(REF_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');
    try {
      const data = extractMovieData(html, file);
      if (!data || !data.title) {
        console.log(`SKIP (no title): ${file}`);
        continue;
      }
      results.push({ file, data });
      console.log(`EXTRACTED: ${data.title} | cast:${data.cast.length} | crew:${data.crew.length} | poster:${data.poster ? 'YES' : 'NO'}`);
    } catch (err) {
      console.error(`ERROR in ${file}: ${err.message}`);
    }
  }

  console.log(`\nTotal extracted: ${results.length} movies`);
  
  // Now update each movie in the database
  let updated = 0, skipped = 0;
  for (const { file, data } of results) {
    // Find by title (case-insensitive)
    const existing = await Movie.findOne({ title: new RegExp('^' + data.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (existing) {
      // Update with all extracted data but keep the local poster path if it exists
      const updateData = {
        about: data.about || existing.about,
        duration: data.duration || existing.duration,
        genres: data.genres.length ? data.genres : existing.genres,
        certification: data.certification || existing.certification,
        languages: data.languages.length ? data.languages : existing.languages,
        formats: data.formats.length ? data.formats : existing.formats,
        releaseDate: data.releaseDate || existing.releaseDate,
        cast: data.cast.length ? data.cast : existing.cast,
        crew: data.crew.length ? data.crew : (existing.crew || []),
        rating: data.rating || existing.rating,
        votes: data.votes || existing.votes,
      };
      // Only update poster with BMS CDN URL if we don't have a local asset
      if (data.poster && (!existing.poster || !existing.poster.startsWith('/assets/'))) {
        updateData.poster = data.poster;
      }
      await Movie.updateOne({ _id: existing._id }, { $set: updateData });
      console.log(`UPDATED: ${data.title}`);
      updated++;
    } else {
      console.log(`NOT FOUND IN DB: ${data.title} (will skip)`);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Updated: ${updated}, Not found in DB: ${skipped}`);
  
  // Show summary of first 3 updated movies
  const sample = await Movie.find({}).sort({_id: -1}).limit(3).lean();
  for (const m of sample) {
    console.log(`\n${m.title}:`);
    console.log(`  about: ${(m.about || '').substring(0, 80)}...`);
    console.log(`  cast: ${(m.cast || []).map(c => c.name).join(', ')}`);
    console.log(`  genres: ${(m.genres || []).join(', ')}`);
    console.log(`  duration: ${m.duration}`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
