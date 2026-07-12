const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  const cast = [
    { name: 'Michael Johnston', role: 'Bear', image: '/assets/cast/michael-johnston-2053989-1767925400.jpg' },
    { name: 'Inde Navarrette', role: 'Nikki', image: '/assets/cast/inde-navarrette-2053990-1767925469.jpg' },
    { name: 'Cooper Tomlinson', role: 'Ian', image: null }, // No image found for Cooper
    { name: 'Megan Lawless', role: 'Sarah', image: '/assets/cast/megan-lawless-2053992-1767925621.jpg' }
  ];

  await Movie.updateOne(
    { title: 'Obsession' },
    { $set: { 
        about: "After breaking the mysterious One Wish Willow to win his crush's heart, a hopeless romantic gets exactly what he wants, only to discover that some desires come at a dark, sinister price.",
        cast: cast, 
        crew: []
      } 
    }
  );
  console.log('✅ Obsession details updated to true cast and synopsis');

  process.exit(0);
}

main().catch(console.error);
