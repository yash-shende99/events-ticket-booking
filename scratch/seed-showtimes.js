const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
  const Theater = mongoose.models.Theater || mongoose.model('Theater', new mongoose.Schema({}, { strict: false }));
  const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    date: String,
    time: String,
    format: String,
    language: String,
    type: String,
    status: String,
    isLate: Boolean
  }, { timestamps: true }));

  console.log('Fetching movies and theaters...');
  const movies = await Movie.find({}, { _id: 1, title: 1, languages: 1, formats: 1 }).lean();
  const theaters = await Theater.find({}, { _id: 1, name: 1 }).lean();

  if (movies.length === 0 || theaters.length === 0) {
    console.log('No movies or theaters found.');
    process.exit(1);
  }

  console.log(`Found ${movies.length} movies and ${theaters.length} theaters. Generating showtimes...`);

  // Clear existing showtimes to start fresh
  await Showtime.deleteMany({});
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const dates = [formatDate(today), formatDate(tomorrow)];
  
  const times = [
    { time: '09:00 AM', isLate: false },
    { time: '12:15 PM', isLate: false },
    { time: '03:30 PM', isLate: false },
    { time: '06:45 PM', isLate: false },
    { time: '10:15 PM', isLate: true },
    { time: '11:55 PM', isLate: true }
  ];

  const types = ["Cancellation Available", "Dolby 7.1", "2K LASER", "4K Dolby Atmos"];
  const statuses = ["available", "available", "filling", "available", "almost-full"];

  const showtimesToInsert = [];

  for (const movie of movies) {
    const movieFormats = movie.formats && movie.formats.length > 0 ? movie.formats : ['2D'];
    const movieLanguages = movie.languages && movie.languages.length > 0 ? movie.languages : ['Hindi'];
    
    // Each movie will be shown in 3 random theaters to distribute them nicely
    const shuffledTheaters = [...theaters].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const theater of shuffledTheaters) {
      for (const date of dates) {
        // Generate 2-4 showtimes per theater per day
        const numShowtimes = Math.floor(Math.random() * 3) + 2; 
        const selectedTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numShowtimes).sort((a, b) => a.time.localeCompare(b.time));
        
        for (const t of selectedTimes) {
          const format = movieFormats[Math.floor(Math.random() * movieFormats.length)];
          const lang = movieLanguages[Math.floor(Math.random() * movieLanguages.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          showtimesToInsert.push({
            movie: movie._id,
            theater: theater._id,
            date: date,
            time: t.time,
            format: format,
            language: lang,
            type: type,
            status: status,
            isLate: t.isLate
          });
        }
      }
    }
  }

  await Showtime.insertMany(showtimesToInsert);
  console.log(`✅ Successfully seeded ${showtimesToInsert.length} showtimes for all ${movies.length} movies.`);

  process.exit(0);
}

main().catch(console.error);
