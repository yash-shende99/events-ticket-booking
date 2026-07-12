const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  // Clear wrong info for the movies the user complained about (and the obvious duplicates)
  const wrongMovies = [
    'Obsession',
    'Lenin',
    'The Invite',
    'Nagabandham - The Secret Treasure',
    'Main Vaapas Aaunga',
    'Cocktail 2',
    'Baby Do Die Do',
    'Idhayam Murali',
    'Mardini',
    'Aajo Ardhangini'
  ];

  for (const title of wrongMovies) {
    await Movie.updateOne(
      { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      { $set: { cast: [], crew: [], about: '' } }
    );
  }

  // Set "proper" movies as featured so they appear at the top
  const properMovies = [
    'Dhamaal 4',
    'Welcome To The Jungle',
    'Toy Story 5',
    'Disclosure Day',
    'Gatta Kusthi 2',
    'Deool Band 2',
    'Minions & Monsters',
    'Backrooms',
    'Evil Dead Burn'
  ];

  // First, unset isFeatured for all
  await Movie.updateMany({}, { $unset: { isFeatured: 1 } });

  // Then set isFeatured for the proper ones
  for (const title of properMovies) {
    await Movie.updateOne(
      { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      { $set: { isFeatured: true } }
    );
  }

  console.log('Fixed wrong info and set featured movies.');
  process.exit(0);
}

main().catch(console.error);
