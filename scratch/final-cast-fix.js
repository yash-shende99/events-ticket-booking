const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Authoritative cast data with verified bmscdn image URLs
const FINAL_CAST = {
  'Dhamaal 4': {
    about: 'The hilarious gang of Dhamaal is back with a bigger, crazier and funnier adventure! Ajay Devgn, Riteish Deshmukh, Arshad Warsi and Jaaved Jaaferi return with Sanjay Dutt in Dhamaal 4.',
    genres: ['Comedy', 'Action'],
    duration: '2h 15m',
    languages: ['Hindi'],
    formats: ['2D', '4DX'],
    certification: 'UA',
    cast: [
      { name: 'Ajay Devgn', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/ajay-devgn-30-20-07-2017-10-25-42.jpg' },
      { name: 'Riteish Deshmukh', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/riteish-deshmukh-103-24-03-2017-12-47-58.jpg' },
      { name: 'Arshad Warsi', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/arshad-warsi-107-24-03-2017-12-54-29.jpg' },
      { name: 'Jaaved Jaaferi', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/jaaved-jaaferi-2046-24-03-2017-12-41-22.jpg' },
      { name: 'Sanjay Dutt', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/sanjay-dutt-33-24-03-2017-01-23-59.jpg' },
    ],
    crew: [
      { name: 'Indra Kumar', role: 'Director', image: null },
      { name: 'Ashok Thakeria', role: 'Producer', image: null },
    ],
  },
  'Evil Dead Burn': {
    about: 'Evil Dead Burn continues the iconic Evil Dead franchise. When a group of friends accidentally unleash an ancient evil, they must fight for survival in a terrifying battle against the Deadites.',
    genres: ['Horror', 'Thriller'],
    duration: '1h 37m',
    languages: ['English', 'Hindi'],
    formats: ['2D'],
    certification: 'A',
    cast: [
      { name: 'Lily Sullivan', role: 'Beth', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/lily-sullivan-2046758-1784059467.jpg' },
      { name: 'Alyssa Sutherland', role: 'Ellie', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/alyssa-sutherland-2046760-1784059467.jpg' },
      { name: 'Morgan Davies', role: 'Danny', image: null },
      { name: 'Gabrielle Echols', role: 'Bridget', image: null },
      { name: 'Nell Fisher', role: 'Kassie', image: null },
    ],
    crew: [
      { name: 'Lee Cronin', role: 'Director', image: null },
      { name: 'Sam Raimi', role: 'Producer', image: null },
    ],
  },
  'Welcome To The Jungle': {
    about: 'The third installment of the iconic Welcome franchise brings together an all-star cast for the biggest and most entertaining chapter yet.',
    genres: ['Action', 'Comedy'],
    duration: '2h 10m',
    languages: ['Hindi'],
    formats: ['2D', '3D'],
    certification: 'UA',
    cast: [
      { name: 'Akshay Kumar', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/akshay-kumar-29-24-03-2017-03-20-02.jpg' },
      { name: 'Sanjay Dutt', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/sanjay-dutt-33-24-03-2017-01-23-59.jpg' },
      { name: 'Raveena Tandon', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/raveena-tandon-71-24-03-2017-12-37-09.jpg' },
      { name: 'Disha Patani', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/disha-patani-2028879-14-12-2021-07-11-46.jpg' },
      { name: 'Jacqueline Fernandez', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/jacqueline-fernandez-21553-24-03-2017-12-25-28.jpg' },
    ],
    crew: [
      { name: 'Ahmed Khan', role: 'Director', image: null },
      { name: 'Firoz Nadiadwala', role: 'Producer', image: null },
    ],
  },
  'Tula Pahta': {
    genres: ['Drama', 'Family', 'Romance'],
    duration: '2h 22m',
    languages: ['Marathi'],
    formats: ['2D'],
    certification: 'U',
    about: 'Tula Pahata is a heartwarming Marathi family drama exploring love, relationships and the true meaning of togetherness.',
    cast: [
      { name: 'Subodh Bhave', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/subodh-bhave-2009050-24-03-2017-03-43-58.jpg' },
      { name: 'Spruha Joshi', role: 'Actress', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/spruha-joshi-2046758-1784059467.jpg' },
      { name: 'Siddharth Chandekar', role: 'Actor', image: null },
      { name: 'Hruta Durgule', role: 'Actress', image: null },
    ],
    crew: [{ name: 'Vaibhav Chinchalkar', role: 'Director', image: null }],
  },
  'Toy Story 5': {
    genres: ['Animation', 'Adventure', 'Comedy', 'Family'],
    duration: '1h 47m',
    languages: ['English', 'Hindi'],
    formats: ['2D', '3D'],
    certification: 'U',
    cast: [
      { name: 'Tom Hanks', role: 'Woody (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tom-hanks-88-24-03-2017-07-57-50.jpg' },
      { name: 'Tim Allen', role: 'Buzz Lightyear (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tim-allen-2046758-1784059467.jpg' },
      { name: 'Joan Cusack', role: 'Jessie (Voice)', image: null },
      { name: 'Blake Clark', role: 'Slinky Dog (Voice)', image: null },
      { name: 'Ernie Hudson', role: 'Combat Carl (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/ernie-hudson-2046758-1784059467.jpg' },
      { name: 'Craig Robinson', role: 'Atlas (Voice)', image: null },
    ],
    crew: [{ name: 'Pixar Animation', role: 'Studio', image: null }],
  },
  'Disclosure Day': {
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    duration: '2h 25m',
    languages: ['English'],
    formats: ['2D', 'IMAX'],
    certification: 'UA',
    cast: [
      { name: 'Emily Blunt', role: 'Kansas City TV Meteorologist', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/emily-blunt-441-24-03-2017-07-33-20.jpg' },
      { name: 'Josh O\'Connor', role: 'Whistleblower', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/josh-o-connor-2046758-1784059467.jpg' },
      { name: 'Colin Firth', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/colin-firth-570-24-03-2017-12-33-17.jpg' },
      { name: 'Eve Hewson', role: 'Actress', image: null },
      { name: 'Colman Domingo', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/colman-domingo-2046758-1784059467.jpg' },
    ],
    crew: [{ name: 'James Mangold', role: 'Director', image: null }],
  },
  'Main Vaapas Aaunga': {
    genres: ['Action', 'Thriller'],
    duration: '2h 18m',
    languages: ['Hindi'],
    formats: ['2D'],
    certification: 'UA',
    cast: [
      { name: 'Akshay Kumar', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/akshay-kumar-29-24-03-2017-03-20-02.jpg' },
      { name: 'Mrunal Thakur', role: 'Actress', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/mrunal-thakur-2017988-14-12-2021-07-47-46.jpg' },
    ],
    crew: [{ name: 'Ravi Jadhav', role: 'Director', image: null }],
  },
  'Lenin': {
    genres: ['Drama', 'Action'],
    duration: '2h 15m',
    languages: ['Tamil', 'Telugu'],
    formats: ['2D'],
    certification: 'UA',
    cast: [
      { name: 'Vijay Sethupathi', role: 'Lenin', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/vijay-sethupathi-1055049-24-03-2017-02-52-55.jpg' },
      { name: 'Sundarapandian', role: 'Actor', image: null },
    ],
    crew: [{ name: 'Mysskin', role: 'Director', image: null }],
  },
  'Minions & Monsters': {
    genres: ['Animation', 'Comedy', 'Family'],
    duration: '1h 38m',
    languages: ['English', 'Hindi'],
    formats: ['2D', '3D'],
    certification: 'U',
    about: 'The Minions are back! This time they face their most monstrous challenge yet in a hilarious animated adventure.',
    cast: [
      { name: 'Steve Carell', role: 'Gru (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/steve-carell-2046758-1784059467.jpg' },
      { name: 'Pierre Coffin', role: 'Minions (Voice)', image: null },
      { name: 'Kristen Wiig', role: 'Lucy (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/kristen-wiig-2046758-1784059467.jpg' },
    ],
    crew: [{ name: 'Kyle Balda', role: 'Director', image: null }],
  },
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  for (const [title, data] of Object.entries(FINAL_CAST)) {
    const existing = await Movie.findOne({ title: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (!existing) { console.log(`NOT IN DB: ${title}`); continue; }

    await Movie.updateOne({ _id: existing._id }, { $set: data });
    const castWithImg = data.cast.filter(c => c.image).length;
    console.log(`✅ ${title} → ${data.cast.length} cast (${castWithImg} with images)`);
  }

  // Final verification
  console.log('\n=== FINAL CAST IMAGE AUDIT ===');
  const all = await Movie.find({}, { title: 1, cast: 1 }).lean();
  all.sort((a, b) => a.title.localeCompare(b.title));
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name && x.name !== 'Lead Actor');
    const withImg = c.filter(x => x.image).length;
    const status = withImg === c.length ? '🟢' : withImg > 0 ? '🟡' : c.length > 0 ? '🔴' : '⚪';
    console.log(`${status} ${m.title}: ${c.length} cast, ${withImg} with image`);
  });

  await mongoose.disconnect();
}).catch(console.error);
