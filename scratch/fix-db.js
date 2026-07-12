const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function fixAndSeed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 1. Fix Cast Images
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, {strict: false}));
  const movies = await Movie.find();
  for (const movie of movies) {
    let changed = false;
    if (movie.cast && Array.isArray(movie.cast)) {
      movie.cast.forEach(c => {
        if (c.image === 'https://via.placeholder.com/150' || c.image === 'https://via.placeholder.com/150') {
          c.image = '/assets/movies/default-pic.png';
          changed = true;
        }
      });
    }
    if (changed) {
      await Movie.updateOne({_id: movie._id}, {$set: {cast: movie.cast}});
    }
  }
  console.log('Fixed cast images.');

  // 2. Re-seed Showtimes
  const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    date: String,
    time: String,
    format: String,
    language: String,
    price: Number,
    type: String,
    status: String,
    isLate: Boolean
  }));
  const Theater = mongoose.models.Theater || mongoose.model('Theater', new mongoose.Schema({}, {strict: false}));

  await Showtime.deleteMany({});
  
  const theaters = await Theater.find();
  if (theaters.length === 0) {
      // Create some theaters if none
      await Theater.insertMany([
          { name: 'Cinepolis: Seasons Mall, Magarpatta City', location: 'Pune', amenities: ['M-Ticket', 'Food & Beverage'] },
          { name: 'PVR: Phoenix Market City, Viman Nagar', location: 'Pune', amenities: ['M-Ticket'] },
          { name: 'INOX: Amanora Mall, Hadapsar', location: 'Pune', amenities: ['Food & Beverage'] }
      ]);
  }
  const allTheaters = await Theater.find();

  const showtimes = [];
  const today = new Date();
  
  for (const movie of movies) {
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Add 2-4 theaters per movie per day
      const movieTheaters = allTheaters.slice(0, Math.floor(Math.random() * 2) + 2);
      
      for (const theater of movieTheaters) {
          showtimes.push({
              movie: movie._id,
              theater: theater._id,
              date: dateStr,
              time: '10:30 AM',
              format: movie.formats && movie.formats[0] ? movie.formats[0] : '2D',
              language: movie.languages && movie.languages[0] ? movie.languages[0] : 'Hindi',
              price: 250,
              type: 'EXECUTIVE',
              status: 'available',
              isLate: false
          });
          showtimes.push({
              movie: movie._id,
              theater: theater._id,
              date: dateStr,
              time: '01:15 PM',
              format: movie.formats && movie.formats[0] ? movie.formats[0] : '2D',
              language: movie.languages && movie.languages[0] ? movie.languages[0] : 'Hindi',
              price: 300,
              type: 'CLUB',
              status: 'filling',
              isLate: false
          });
          showtimes.push({
              movie: movie._id,
              theater: theater._id,
              date: dateStr,
              time: '09:45 PM',
              format: movie.formats && movie.formats[0] ? movie.formats[0] : '2D',
              language: movie.languages && movie.languages[0] ? movie.languages[0] : 'Hindi',
              price: 400,
              type: 'ROYAL',
              status: 'almost-full',
              isLate: true
          });
      }
    }
  }

  await Showtime.insertMany(showtimes);
  console.log(`Seeded ${showtimes.length} showtimes.`);

  await mongoose.disconnect();
}

fixAndSeed().catch(console.error);
