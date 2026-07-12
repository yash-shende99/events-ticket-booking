const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
  
  await Movie.updateOne({ title: 'Minions & Monsters' }, {
    $set: {
      cast: [
        { name: 'Steve Carell', role: 'Gru (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/steve-carell-2046758-1751516467.jpg' },
        { name: 'Pierre Coffin', role: 'Minions (Voice)', image: null },
      ],
      crew: [{ name: 'Kyle Balda', role: 'Director', image: null }],
      genres: ['Animation', 'Comedy', 'Family'],
      languages: ['English', 'Hindi'],
      formats: ['2D', '3D'],
      certification: 'U',
      about: 'The Minions are back in their most monstrous adventure yet! Gru and the Minions face hilarious new threats in this animated comedy.',
    }
  });
  console.log('Fixed Minions & Monsters');
  await mongoose.disconnect();
}).catch(console.error);
