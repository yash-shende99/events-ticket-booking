const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'.env.local'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, {strict: false}));
    
    await Movie.updateOne({title: 'Moana'}, {$set: {poster: '/assets/movies/1783671474644_moanaweb.jpg'}});
    await Movie.updateOne({title: 'Evil Dead'}, {$set: {poster: '/assets/movies/et00369379-faqwzaebqc-portrait.jpg'}});
    await Movie.updateOne({title: 'Dhamaal 4'}, {$set: {poster: '/assets/movies/et00403805-cxrwswcesf-portrait.jpg'}});
    await Movie.updateOne({title: 'The Odyssey'}, {$set: {poster: '/assets/movies/et00447840-xckkhurxjp-portrait.jpg'}});
    await Movie.updateOne({title: 'Alpha'}, {$set: {poster: '/assets/movies/et00452034-qrgdyxqlhb-portrait.jpg'}});
    
    console.log('Updated posters successfully!');
    process.exit(0);
}).catch(console.error);
