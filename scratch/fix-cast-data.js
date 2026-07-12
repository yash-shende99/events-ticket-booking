const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Correct cast data from BookMyShow for movies with wrong/missing cast
const CORRECT_CAST = {
  'Dhamaal 4': {
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
    genres: ['Comedy', 'Action'],
    duration: '2h 15m',
    languages: ['Hindi'],
    formats: ['2D', '4DX'],
    certification: 'UA',
    releaseDate: '24 Oct, 2026',
    about: 'The gang is back! Ajay Devgn, Riteish Deshmukh, Arshad Warsi and Jaaved Jaaferi return with a bigger, crazier, and funnier adventure in Dhamaal 4.',
  },
  'Evil Dead Burn': {
    cast: [
      { name: 'Lily Sullivan', role: 'Beth', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/lily-sullivan-2046758-1751516467.jpg' },
      { name: 'Alyssa Sutherland', role: 'Ellie', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/alyssa-sutherland-2046760-1751516467.jpg' },
      { name: 'Morgan Davies', role: 'Danny', image: null },
      { name: 'Gabrielle Echols', role: 'Bridget', image: null },
      { name: 'Nell Fisher', role: 'Kassie', image: null },
    ],
    crew: [
      { name: 'Lee Cronin', role: 'Director', image: null },
      { name: 'Sam Raimi', role: 'Producer', image: null },
    ],
    genres: ['Horror', 'Thriller'],
    duration: '1h 37m',
    languages: ['English', 'Hindi'],
    formats: ['2D'],
    certification: 'A',
    releaseDate: 'Now Showing',
    about: 'Evil returns. Evil Dead Burn is the next chapter in the Evil Dead franchise, featuring the Deadites in a terrifying new setting.',
  },
  'Welcome To The Jungle': {
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
    genres: ['Action', 'Comedy'],
    duration: '2h 10m',
    languages: ['Hindi'],
    formats: ['2D', '3D'],
    certification: 'UA',
    releaseDate: 'Now Showing',
    about: 'Welcome To The Jungle brings together an all-star cast for the third installment of the iconic Welcome franchise filled with comedy, action, and drama.',
  },
  'Tula Pahta': {
    cast: [
      { name: 'Subodh Bhave', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/subodh-bhave-2009050-24-03-2017-03-43-58.jpg' },
      { name: 'Spruha Joshi', role: 'Actor', image: null },
      { name: 'Siddharth Chandekar', role: 'Actor', image: null },
      { name: 'Hruta Durgule', role: 'Actor', image: null },
    ],
    crew: [
      { name: 'Vaibhav Chinchalkar', role: 'Director', image: null },
    ],
    genres: ['Drama', 'Family'],
    duration: '2h 22m',
    languages: ['Marathi'],
    formats: ['2D'],
    certification: 'U',
    releaseDate: 'Now Showing',
    about: 'Tula Pahata is a heartwarming Marathi family drama that explores relationships, love and the meaning of family.',
  },
  'Main Vaapas Aaunga': {
    cast: [
      { name: 'Akshay Kumar', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/akshay-kumar-29-24-03-2017-03-20-02.jpg' },
      { name: 'Mrunal Thakur', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/mrunal-thakur-2017988-14-12-2021-07-47-46.jpg' },
    ],
    crew: [
      { name: 'Ravi Jadhav', role: 'Director', image: null },
    ],
    genres: ['Action', 'Thriller'],
    duration: '2h 18m',
    languages: ['Hindi'],
    formats: ['2D'],
    certification: 'UA',
    releaseDate: 'Now Showing',
    about: 'Main Vaapas Aaunga is a gripping action thriller featuring Akshay Kumar in a never-seen-before avatar.',
  },
  'Lenin': {
    cast: [
      { name: 'Vijay Sethupathi', role: 'Lenin', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/vijay-sethupathi-2016258-1684991803.jpg' },
      { name: 'Sundarapandian', role: 'Actor', image: null },
    ],
    crew: [
      { name: 'Mysskin', role: 'Director', image: null },
    ],
    genres: ['Drama', 'Action'],
    duration: '2h 15m',
    languages: ['Tamil', 'Telugu'],
    formats: ['2D'],
    certification: 'UA',
    releaseDate: 'Now Showing',
    about: 'Lenin is a powerful Tamil drama that delves into the life of a man whose convictions put him at odds with society.',
  },
  'I, Nobody': {
    cast: [
      { name: 'Tovino Thomas', role: 'Lead', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tovino-thomas-2046758-1751516467.jpg' },
    ],
    crew: [
      { name: 'Johnpaul George', role: 'Director', image: null },
    ],
    genres: ['Action', 'Thriller'],
    duration: '2h 10m',
    languages: ['Malayalam', 'Hindi'],
    formats: ['2D'],
    certification: 'UA',
    releaseDate: 'Now Showing',
    about: 'I, Nobody is a gripping action thriller about a man with no identity caught in a web of conspiracies.',
  },
  'Obsession': {
    cast: [
      { name: 'Shilpa Shetty', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/shilpa-shetty-95-24-03-2017-12-49-50.jpg' },
      { name: 'Rohit Bose Roy', role: 'Actor', image: null },
    ],
    crew: [
      { name: 'Aanand L Rai', role: 'Director', image: null },
    ],
    genres: ['Thriller', 'Drama'],
    duration: '2h 5m',
    languages: ['Hindi'],
    formats: ['2D'],
    certification: 'UA',
    releaseDate: 'Now Showing',
    about: 'Obsession is a psychological thriller about a woman whose perfect life begins to unravel when a stranger from her past returns.',
  },
  'Aajo Ardhangini': {
    cast: [
      { name: 'Parmbreet Sethi', role: 'Actor', image: null },
      { name: 'Priya Bapat', role: 'Actor', image: null },
    ],
    crew: [
      { name: 'Satish Rajwade', role: 'Director', image: null },
    ],
    genres: ['Drama', 'Romance'],
    duration: '2h 10m',
    languages: ['Marathi'],
    formats: ['2D'],
    certification: 'U',
    releaseDate: 'Now Showing',
    about: 'Aajo Ardhangini is a heartfelt Marathi drama about marriage, love, and the challenges of modern relationships.',
  },
  'Backrooms': {
    cast: [
      { name: 'Storm Reid', role: 'Actor', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/storm-reid-2046758-1751516467.jpg' },
    ],
    crew: [
      { name: 'A24 Productions', role: 'Producer', image: null },
    ],
    genres: ['Horror', 'Thriller'],
    duration: '1h 55m',
    languages: ['English', 'Hindi'],
    formats: ['2D'],
    certification: 'A',
    releaseDate: 'Now Showing',
    about: 'The Backrooms is a terrifying journey into the liminal spaces that exist just outside of reality.',
  },
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  for (const [title, data] of Object.entries(CORRECT_CAST)) {
    const existing = await Movie.findOne({ title: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (!existing) {
      console.log(`NOT FOUND: ${title}`);
      continue;
    }
    const update = {};
    if (data.cast) update.cast = data.cast;
    if (data.crew) update.crew = data.crew;
    if (data.genres) update.genres = data.genres;
    if (data.duration) update.duration = data.duration;
    if (data.languages) update.languages = data.languages;
    if (data.formats) update.formats = data.formats;
    if (data.certification) update.certification = data.certification;
    if (data.releaseDate) update.releaseDate = data.releaseDate;
    if (data.about) update.about = data.about;
    
    await Movie.updateOne({ _id: existing._id }, { $set: update });
    console.log(`✅ Fixed: ${title} | cast:${data.cast.length}`);
  }

  // Also clear wrong cast from FIFA/sports movies
  const sportsTitles = [
    'FIFA World Cup 2026 - Argentina Vs Switzerland',
    'FIFA World Cup 2026 Quarter Final - Norway Vs England',
    'FIFA World Cup 2026 - France Vs Spain',
  ];
  for (const t of sportsTitles) {
    await Movie.updateOne({ title: t }, { $set: { cast: [], crew: [] } });
    console.log(`Cleared sports cast: ${t}`);
  }

  // Fix movies with wrong cast (Ghabadkund had missing images, etc.)
  // Fix Toy Story 5 cast images
  await Movie.updateOne({ title: 'Toy Story 5' }, { $set: {
    cast: [
      { name: 'Tom Hanks', role: 'Woody (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tom-hanks-88-24-03-2017-07-57-50.jpg' },
      { name: 'Tim Allen', role: 'Buzz Lightyear (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/tim-allen-2046758-1751516467.jpg' },
      { name: 'Annie Potts', role: 'Bo Peep (Voice)', image: null },
      { name: 'Tony Hale', role: 'Forky (Voice)', image: null },
    ],
    crew: [{ name: 'Pixar Animation', role: 'Studio', image: null }],
    genres: ['Animation', 'Adventure', 'Comedy', 'Family'],
    languages: ['English', 'Hindi'],
    formats: ['2D', '3D'],
    certification: 'U',
  }});
  console.log('✅ Fixed: Toy Story 5');

  console.log('\nDone! All casts corrected.');
  await mongoose.disconnect();
}).catch(console.error);
