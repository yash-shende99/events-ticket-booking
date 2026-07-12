const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Unused posters (not currently assigned to any movie):
// et00403805 - Dhamaal 4 (original)
// et00447840 - The Odyssey (original)
// et00452034 - Alpha (original)
// et00472951 - unused
// et00452553 - actually Dhamaal 4 poster (was wrongly given to Spider-Man)

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

    // Fix Spider-Man: give it one of the truly unused posters
    await Movie.updateOne(
        { title: 'Spider-Man: Brand New Day' },
        { $set: { poster: '/assets/movies/et00472951-nzgzdpkuzf-portrait.jpg' } }
    );
    console.log('Fixed Spider-Man poster -> et00472951');

    // Add Dhamaal 4 back with the correct Dhamaal 4 poster (et00452553 = the one showing DHAMAAL 4 text)
    await Movie.create({
        title: 'Dhamaal 4',
        poster: '/assets/movies/et00452553-ahtvqhdary-portrait.jpg',
        rating: '8.9',
        votes: '90K Votes',
        formats: ['2D', '3D', 'IMAX'],
        languages: ['Hindi', 'English', 'Marathi'],
        duration: '2h 30m',
        genres: ['Comedy', 'Action'],
        certification: 'UA',
        releaseDate: '24 Oct, 2026',
        about: 'The hilarious gang is back! Dhamaal 4 brings your favourite comedy characters in a brand new adventure full of laughter, chaos and madness.',
        cast: [],
    });
    console.log('Added Dhamaal 4 back with correct poster.');

    // Verify
    const movies = await Movie.find({}, { title: 1, poster: 1 }).sort({ _id: -1 }).lean();
    console.log('\nFinal state:');
    movies.forEach(m => console.log(` - ${m.title} => ${m.poster}`));

    await mongoose.disconnect();
}).catch(console.error);
