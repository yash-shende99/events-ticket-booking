const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');
const CAST_DIR = path.join(__dirname, '..', 'public', 'assets', 'cast');

function cp(folder, file) {
  if (!file) return null;
  const src = path.join(REF_DIR, folder, file);
  if (!fs.existsSync(src)) return null;
  const dest = path.join(CAST_DIR, file);
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return `/assets/cast/${file}`;
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
  const gkFolder = 'Gatta Kusthi 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow_files';

  // Gatta Kusthi 2 has its own cast images in _files
  const gkCast = [
    { name: 'Vishnu Vishal', role: 'Actor', image: cp(gkFolder, 'vishnu-vishal-19193-1761113697.jpg') },
    { name: 'Aishwarya Lekshmi', role: 'Actress', image: cp(gkFolder, 'aishwarya-lekshmi-1085670-21-12-2017-11-33-11.jpg') },
    { name: 'Ramya Krishnan', role: 'Actress', image: cp(gkFolder, 'ramya-krishnan-2920-18-09-2017-05-34-55.jpg') },
    { name: 'Yogi Babu', role: 'Actor', image: cp(gkFolder, 'yogi-babu-1055754-02-12-2021-12-53-23.jpg') },
    { name: 'Karunas', role: 'Actor', image: cp(gkFolder, 'karunas-4028-24-03-2017-12-51-09.jpg') },
    { name: 'Kaali Venkat', role: 'Actor', image: cp(gkFolder, 'kaali-venkat-1046320-1725444519.jpg') },
    { name: 'Karunakaran', role: 'Actor', image: cp(gkFolder, 'karunakaran-1047617-1680242474.jpg') },
  ];
  await Movie.updateOne({ title: 'Gatta Kusthi 2' }, { $set: { cast: gkCast, genres: ['Comedy', 'Drama', 'Sports'], languages: ['Tamil'], formats: ['2D'], certification: 'UA' } });
  console.log('✅ Gatta Kusthi 2: updated with real images');
  gkCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // Welcome To The Jungle — use its own correct images
  const wtjFolder = 'Welcome To The Jungle (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files';
  const wtjCast = [
    { name: 'Akshay Kumar', role: 'Actor', image: cp(wtjFolder, 'akshay-kumar-94-1681713982.jpg') },
    { name: 'Suniel Shetty', role: 'Actor', image: cp(wtjFolder, 'suniel-shetty-2291-09-09-2019-01-21-33.jpg') },
    { name: 'Tusshar Kapoor', role: 'Actor', image: cp(wtjFolder, 'tusshar-kapoor-2410-24-03-2017-14-01-49.jpg') },
    { name: 'Rajpal Yadav', role: 'Actor', image: cp(wtjFolder, 'rajpal-yadav-1802-24-03-2017-12-33-13.jpg') },
    { name: 'Disha Patani', role: 'Actress', image: cp(wtjFolder, 'disha-patani-1061408-1714379037.jpg') },
    { name: 'Jacqueline Fernandez', role: 'Actress', image: cp(wtjFolder, 'jacqueline-fernandez-16339-1736249165.jpg') },
  ];
  await Movie.updateOne({ title: 'Welcome To The Jungle' }, { $set: { cast: wtjCast } });
  console.log('\n✅ Welcome To The Jungle: updated with real images');
  wtjCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // Toy Story 5 — use CDN images for known actors
  const ts5Cast = [
    { name: 'Tom Hanks', role: 'Woody (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tom-hanks-88-24-03-2017-07-57-50.jpg' },
    { name: 'Tim Allen', role: 'Buzz Lightyear (Voice)', image: null },
    { name: 'Joan Cusack', role: 'Jessie (Voice)', image: null },
    { name: 'Blake Clark', role: 'Slinky Dog (Voice)', image: null },
    { name: 'Ernie Hudson', role: 'Combat Carl (Voice)', image: null },
    { name: 'Craig Robinson', role: 'Atlas (Voice)', image: null },
  ];
  await Movie.updateOne({ title: 'Toy Story 5' }, { $set: { cast: ts5Cast } });
  console.log('\n✅ Toy Story 5: updated');

  console.log('\n=== FINAL AUDIT ===');
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  all.sort((a, b) => a.title.localeCompare(b.title));
  let tot = 0, wi = 0;
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const w = c.filter(x => x.image).length;
    tot += c.length; wi += w;
    const icon = w === c.length && c.length > 0 ? '🟢' : w > 0 ? '🟡' : c.length > 0 ? '🔴' : '⚪';
    console.log(`${icon} ${m.title}: ${w}/${c.length}`);
  });
  console.log(`\nTotal: ${wi}/${tot} (${Math.round(wi/tot*100)}%)`);

  await mongoose.disconnect();
}).catch(console.error);
