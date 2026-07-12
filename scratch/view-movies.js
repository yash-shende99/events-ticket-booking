const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
  
  const movies = await Movie.find({ title: { $in: [/^Obsession$/i, /^Lenin$/i] } }, { title: 1, cast: 1, crew: 1, about: 1 }).lean();
  console.log(JSON.stringify(movies, null, 2));
  
  process.exit(0);
}

main().catch(console.error);
