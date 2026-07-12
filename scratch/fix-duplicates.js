const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

    // 1. Remove the duplicate old entries (the ones with wrong "Tula Pahta" poster)
    // These are the 5 manually added duplicates that have wrong poster et00500266
    // Keep only the ones with proper data (Evil Dead Burn, Dhamaal 4 etc. from the reference)
    
    // Find ALL duplicates and remove the ones with wrong posters
    const wrongPoster = '/assets/movies/et00500266-ltgysjdbdj-portrait.jpg';
    
    const duplicateTitles = ['Evil Dead', 'Dhamaal 4', 'The Odyssey', 'Alpha', 'Moana'];
    for (const title of duplicateTitles) {
        await Movie.deleteMany({ title: title });
        console.log(`Deleted all entries for: ${title}`);
    }

    // Fix Spider-Man poster - it was sharing The Odyssey's image, assign it a unique one
    await Movie.updateOne(
        { title: 'Spider-Man: Brand New Day' },
        { $set: { poster: '/assets/movies/et00452553-ahtvqhdary-portrait.jpg' } }
    );
    console.log('Fixed Spider-Man poster.');

    // Fix Evil Dead Burn poster (assign proper unique one)
    await Movie.updateOne(
        { title: 'Evil Dead Burn' },
        { $set: { poster: '/assets/movies/et00496605-fvycsspxld-portrait.jpg' } }
    );
    console.log('Fixed Evil Dead Burn poster.');

    // List current state
    const movies = await Movie.find({}, { title: 1, poster: 1 }).sort({ _id: -1 }).lean();
    console.log('\nCurrent movies in DB:');
    movies.forEach(m => console.log(` - ${m.title} | ${m.poster}`));

    await mongoose.disconnect();
}).catch(console.error);
