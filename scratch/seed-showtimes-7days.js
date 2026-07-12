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

  // Clear existing showtimes to start fresh with the new date range
  await Showtime.deleteMany({});
  console.log('Cleared existing showtimes.');
  
  // Generate a 7-day booking window
  const dates = [];
  const today = new Date();
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(formatDate(d));
  }
  
  const times = [
    { time: '09:00 AM', isLate: false },
    { time: '12:15 PM', isLate: false },
    { time: '03:30 PM', isLate: false },
    { time: '06:45 PM', isLate: false },
    { time: '10:15 PM', isLate: true },
    { time: '11:55 PM', isLate: true }
  ];

  const types = ["Cancellation Available", "Dolby 7.1", "2K LASER", "4K Dolby Atmos"];
  const statuses = ["available", "available", "available", "filling", "almost-full"];

  const showtimesToInsert = [];

  for (const movie of movies) {
    const movieFormats = movie.formats && movie.formats.length > 0 ? movie.formats : ['2D'];
    const movieLanguages = movie.languages && movie.languages.length > 0 ? movie.languages : ['Hindi'];
    
    for (const theater of theaters) {
      for (const date of dates) {
        // Generate 2-4 showtimes per theater per day for this movie
        const numShowtimes = Math.floor(Math.random() * 3) + 2; 
        const selectedTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numShowtimes).sort((a, b) => {
            // Sort by AM/PM then by hour to ensure chronological order in DB (easier to read)
            const aIsPM = a.time.includes('PM');
            const bIsPM = b.time.includes('PM');
            if (aIsPM && !bIsPM) return 1;
            if (!aIsPM && bIsPM) return -1;
            return a.time.localeCompare(b.time);
        });
        
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
  console.log(`✅ Successfully seeded ${showtimesToInsert.length} showtimes covering 7 full days for all ${movies.length} movies across all ${theaters.length} theaters.`);

  process.exit(0);
}

main().catch(console.error);
