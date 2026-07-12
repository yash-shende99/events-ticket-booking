const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const CAST_DIR = path.join(__dirname, '..', 'public', 'assets', 'cast');

// Direct manual mapping: DB movie title → cast with exact filename from _files
const DIRECT_CAST_MAP = {
  'Dhamaal 4': [
    { name: 'Ajay Devgn', role: 'Actor', file: 'ajay-devgn-24051-12-09-2017-04-41-13.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Riteish Deshmukh', role: 'Actor', file: 'riteish-deshmukh-25378-13-09-2017-04-40-50.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Arshad Warsi', role: 'Actor', file: 'arshad-warsi-228-14-09-2017-01-59-07.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Jaaved Jaaferi', role: 'Actor', file: 'javed-jaffreyy-940-1741788503.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Ravi Kishan', role: 'Actor', file: 'ravi-kishan-1846-1684385167.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Sanjay Mishra', role: 'Actor', file: 'sanjay-mishra-2041-24-03-2017-12-33-13.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
    { name: 'Upendra Limaye', role: 'Actor', file: 'upendra-limaye-9842-1709889454.jpg', from: 'Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files' },
  ],
  'Ghabadkund': [
    { name: 'Sandeep Pathak', role: 'Actor', file: null, from: null },
    { name: 'Devdatta Nage', role: 'Actor', file: null, from: null },
    { name: 'Shashank Shende', role: 'Actor', file: null, from: null },
    { name: 'Prajakta Hanamghar', role: 'Actor', file: null, from: null },
    { name: 'Ahemad Deshmukh', role: 'Actor', file: null, from: null },
    { name: 'Kushal Badrike', role: 'Actor', file: null, from: null },
    { name: 'Pravin Dalimbkar', role: 'Actor', file: null, from: null },
    { name: 'Vaishnavi Kalyankar', role: 'Actor', file: null, from: null },
    { name: 'Arohi Bhoir', role: 'Actor', file: null, from: null },
    { name: 'Sahil Annaldewar', role: 'Actor', file: null, from: null },
    { name: 'Smita Paygude Anjute', role: 'Actor', file: null, from: null },
  ],
};

// For movies that have their _files cast images — scan and auto-map by listing the jpgs
const REF_DIR = path.join(__dirname, '..', 'ref', 'movies_ref');

function getJpgsFromFolder(folderName) {
  const dir = path.join(REF_DIR, folderName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
}

function sanitize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function copyAndGetPath(srcFolder, filename) {
  const src = path.join(REF_DIR, srcFolder, filename);
  if (!fs.existsSync(src)) return null;
  const dest = path.join(CAST_DIR, filename);
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  return `/assets/cast/${filename}`;
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  // ===== Fix Dhamaal 4 with correct cast images from _files =====
  const dhamaalFiles = getJpgsFromFolder('Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files');
  console.log('Dhamaal 4 _files jpgs:', dhamaalFiles.join(', '));

  const dhamaalCast = [
    { name: 'Ajay Devgn', role: 'Actor', file: 'ajay-devgn-24051-12-09-2017-04-41-13.jpg' },
    { name: 'Riteish Deshmukh', role: 'Actor', file: 'riteish-deshmukh-25378-13-09-2017-04-40-50.jpg' },
    { name: 'Arshad Warsi', role: 'Actor', file: 'arshad-warsi-228-14-09-2017-01-59-07.jpg' },
    { name: 'Jaaved Jaaferi', role: 'Actor', file: 'javed-jaffreyy-940-1741788503.jpg' },
    { name: 'Ravi Kishan', role: 'Actor', file: 'ravi-kishan-1846-1684385167.jpg' },
    { name: 'Sanjay Mishra', role: 'Actor', file: 'sanjay-mishra-2041-24-03-2017-12-33-13.jpg' },
    { name: 'Upendra Limaye', role: 'Actor', file: 'upendra-limaye-9842-1709889454.jpg' },
  ].map(c => {
    const img = copyAndGetPath('Dhamaal 4 (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files', c.file);
    return { name: c.name, role: c.role, image: img };
  });

  await Movie.updateOne({ title: 'Dhamaal 4' }, { $set: { cast: dhamaalCast, genres: ['Comedy', 'Action'], languages: ['Hindi'], formats: ['2D'], certification: 'UA' } });
  console.log('✅ Dhamaal 4: updated with real cast images');
  dhamaalCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // ===== Fix Evil Dead Burn =====
  const evilFiles = getJpgsFromFolder('Evil Dead Burn (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files');
  console.log('\nEvil Dead Burn _files jpgs:', evilFiles.join(', '));
  const evilFolder = 'Evil Dead Burn (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files';
  // These are Welcome To The Jungle's images — Evil Dead Burn's HTML was wrong
  // Use the Lily Sullivan image if it exists, otherwise null
  const evilCast = [
    { name: 'Lily Sullivan', role: 'Beth', image: copyAndGetPath(evilFolder, evilFiles.find(f => f.toLowerCase().includes('lily')) || '') },
    { name: 'Alyssa Sutherland', role: 'Ellie', image: copyAndGetPath(evilFolder, evilFiles.find(f => f.toLowerCase().includes('alyssa')) || '') },
    { name: 'Morgan Davies', role: 'Danny', image: null },
    { name: 'Gabrielle Echols', role: 'Bridget', image: null },
    { name: 'Nell Fisher', role: 'Kassie', image: null },
  ];
  await Movie.updateOne({ title: 'Evil Dead Burn' }, { $set: { cast: evilCast } });
  console.log('\n✅ Evil Dead Burn: updated');
  evilCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // ===== Fix Welcome To The Jungle (its _files has the correct images) =====
  const wtjFolder = 'Welcome To The Jungle (2026) - Movie _ Reviews, Cast & Release Date in Mumbai- BookMyShow_files';
  const wtjFiles = getJpgsFromFolder(wtjFolder);
  console.log('\nWelcome To The Jungle _files jpgs:', wtjFiles.join(', '));
  
  const wtjCast = [
    { name: 'Akshay Kumar', role: 'Actor', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('akshay')) || '') },
    { name: 'Sanjay Dutt', role: 'Actor', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('sanjay-d')) || '') },
    { name: 'Raveena Tandon', role: 'Actress', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('raveena')) || '') },
    { name: 'Disha Patani', role: 'Actress', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('disha')) || '') },
    { name: 'Jacqueline Fernandez', role: 'Actress', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('jacqueline')) || '') },
    { name: 'Alia Bhatt', role: 'Actress', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('alia')) || '') },
    { name: 'Anil Kapoor', role: 'Actor', image: copyAndGetPath(wtjFolder, wtjFiles.find(f => f.toLowerCase().includes('anil')) || '') },
  ].filter(c => c.name);
  await Movie.updateOne({ title: 'Welcome To The Jungle' }, { $set: { cast: wtjCast } });
  console.log('\n✅ Welcome To The Jungle: updated');
  wtjCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // ===== Fix Idhayam Murali — scan its _files for actor jpgs =====
  const idhFolder = 'Idhayam Murali (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow_files';
  const idhFiles = getJpgsFromFolder(idhFolder);
  console.log('\nIdhayam Murali _files jpgs:', idhFiles.join(', '));
  const idhCastNames = ['Vishnuu Vishal', 'Aishwarya Lekshmi', 'Ramya Krishnan', 'Yogi Babu', 'Karunas', 'Kaali Venkat', 'Karunakaran', 'Munishkanth', 'Mokksha Sengupta', 'Zara Zyanna', 'Tarak Ponnappa'];
  const idhCast = idhCastNames.map((name, i) => {
    const img = idhFiles[i] ? copyAndGetPath(idhFolder, idhFiles[i]) : null;
    return { name, role: 'Actor', image: img };
  });
  await Movie.updateOne({ title: 'Idhayam Murali' }, { $set: { cast: idhCast } });
  console.log('\n✅ Idhayam Murali: updated');
  idhCast.forEach(c => console.log(`   ${c.image ? '✅' : '❌'} ${c.name}`));

  // ===== Fix Gatta Kusthi 2 — same cast as Idhayam Murali from same _files =====
  const gkFolder = 'Gatta Kusthi 2 (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow_files';
  if (fs.existsSync(path.join(REF_DIR, gkFolder))) {
    const gkFiles = getJpgsFromFolder(gkFolder);
    console.log('\nGatta Kusthi 2 _files jpgs:', gkFiles.join(', '));
    // Use idhayam murali cast for now since it's the same HTML
    await Movie.updateOne({ title: 'Gatta Kusthi 2' }, { $set: { cast: idhCast } });
    console.log('✅ Gatta Kusthi 2: synced with Idhayam Murali cast');
  }

  // ===== Fix Tumbadchi Manjula =====
  const tumFolder = 'Tumbadchi Manjula (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow_files';
  const tumFiles = getJpgsFromFolder(tumFolder);
  console.log('\nTumbadchi Manjula _files jpgs:', tumFiles.join(', '));
  const tumNames = ['Jitendra Joshi', 'Om Bhutkar', 'Makarand Anaspure', 'Sai Tamhankar', 'Usha Nadkarni', 'Anshuman Vichare', 'Priyal Naik', 'Atharav Ruke', 'Ganesh Pandit', 'Umesh Jagtap', 'Yogesh Shirsat', 'Abhay Khadapkar', 'Varsha Dandale', 'Diya Rane', 'Siddheshwar Zadbuke'];
  const tumCast = tumNames.map((name, i) => {
    const img = tumFiles[i] ? copyAndGetPath(tumFolder, tumFiles[i]) : null;
    return { name, role: 'Actor', image: img };
  });
  await Movie.updateOne({ title: 'Tumbadchi Manjula' }, { $set: { cast: tumCast } });
  console.log('✅ Tumbadchi Manjula: updated with images');

  // ===== Fix Mother Promise =====
  const mpFolder = 'Mother Promise (2026) - Movie _ Reviews, Cast & Release Date in Pune- BookMyShow_files';
  const mpFiles = getJpgsFromFolder(mpFolder);
  console.log('\nMother Promise _files jpgs:', mpFiles.join(', '));
  const mpNames = ['Dhananjaya', 'Poornachandra Mysuru', 'Chi Guru Dutt', 'Nagabhushana N S', 'Vinaya Prasad', 'Geetha', 'Mahadev Prasad', 'Naresh Dingri', 'Srivatsa Shyam', 'Arun Bharamannavar', 'Yashwanth MK', 'Poornachandra Mysore'];
  const mpCast = mpNames.map((name, i) => {
    const img = mpFiles[i] ? copyAndGetPath(mpFolder, mpFiles[i]) : null;
    return { name, role: 'Actor', image: img };
  });
  await Movie.updateOne({ title: 'Mother Promise' }, { $set: { cast: mpCast } });
  console.log('✅ Mother Promise: updated with images');

  console.log('\n\n=== GRAND FINAL AUDIT ===');
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  all.sort((a, b) => a.title.localeCompare(b.title));
  let total = 0, withImg = 0;
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const wi = c.filter(x => x.image).length;
    total += c.length;
    withImg += wi;
    const icon = wi === c.length && c.length > 0 ? '🟢' : wi > 0 ? '🟡' : c.length > 0 ? '🔴' : '⚪';
    console.log(`${icon} ${m.title}: ${wi}/${c.length}`);
  });
  console.log(`\nGrand total: ${withImg}/${total} cast members have images (${Math.round(withImg/total*100)}%)`);

  await mongoose.disconnect();
}).catch(console.error);
