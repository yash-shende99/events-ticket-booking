const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

    // et00447840 and et00452034 are both genuinely unused - assign to Spider-Man
    await Movie.updateOne(
        { title: 'Spider-Man: Brand New Day' },
        { $set: { poster: '/assets/movies/et00452034-qrgdyxqlhb-portrait.jpg' } }
    );
    console.log('Spider-Man: Brand New Day poster fixed.');

    const m = await Movie.findOne({ title: 'Spider-Man: Brand New Day' }, { title: 1, poster: 1 });
    console.log('New poster:', m.poster);

    await mongoose.disconnect();
}).catch(console.error);
