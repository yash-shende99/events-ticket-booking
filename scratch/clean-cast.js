const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Fix movies where cast exists but images are null (from local files without bmscdn URLs)
// We'll just clear null images so they show initials avatar gracefully
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  // Get all movies and for each cast member with null image, set a fallback
  const movies = await Movie.find({}).lean();
  let totalFixed = 0;

  for (const movie of movies) {
    const cast = movie.cast || [];
    const crew = movie.crew || [];
    let changed = false;

    // For movies where images are from bmscdn (valid) - keep them
    // For movies where images are null - they'll show initials (already handled in UI)
    // But ensure cast with placeholder names are removed
    const cleanCast = cast.filter(c => 
      c.name && 
      c.name !== 'Lead Actor' && 
      c.name !== 'Supporting Actor' &&
      c.name.trim().length > 1
    );
    const cleanCrew = crew.filter(c => 
      c.name && 
      c.name !== 'Lead Actor' && 
      c.name !== 'Supporting Actor' &&
      c.name.trim().length > 1
    );

    if (cleanCast.length !== cast.length || cleanCrew.length !== crew.length) {
      await Movie.updateOne({ _id: movie._id }, { $set: { cast: cleanCast, crew: cleanCrew } });
      changed = true;
    }

    // Fix Minions & Monsters - it had no cast
    if (movie.title === 'Minions & Monsters' && cast.length === 0) {
      await Movie.updateOne({ _id: movie._id }, { $set: {
        cast: [
          { name: 'Steve Carell', role: 'Gru (Voice)', image: 'https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/steve-carell-2046758-1751516467.jpg' },
          { name: 'Pierre Coffin', role: 'Minions (Voice)', image: null },
        ],
        crew: [{ name: 'Kyle Balda', role: 'Director', image: null }],
        genres: ['Animation', 'Comedy', 'Family'],
        languages: ['English', 'Hindi'],
        formats: ['2D', '3D'],
        certification: 'U',
        about: 'The Minions are back! This time they face their most monstrous challenge yet in this hilarious animated adventure.',
      }});
      console.log('Fixed: Minions & Monsters');
    }

    if (changed) totalFixed++;
  }

  console.log(`Cleaned placeholder cast from ${totalFixed} movies.`);

  // Final audit
  const all = await Movie.find({}, {title: 1, cast: 1, duration: 1, genres: 1}).lean();
  console.log('\n=== FINAL STATE ===');
  all.forEach(m => {
    const c = (m.cast || []).filter(x => x.name);
    const withImg = c.filter(x => x.image).length;
    console.log(`${m.title} | cast:${c.length} (${withImg} with img) | genres:${(m.genres||[]).join(',')} | dur:${m.duration}`);
  });

  await mongoose.disconnect();
}).catch(console.error);
