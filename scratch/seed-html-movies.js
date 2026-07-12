const mongoose = require('mongoose');
const fs = require('fs');

async function seed() {
  await mongoose.connect('mongodb+srv://hvdpvd4:c.i-jGg7ajkfQ3c@cluster0.jbd44.mongodb.net/eventsbooking?retryWrites=true&w=majority');
  const db = mongoose.connection.db;

  const html = fs.readFileSync('ref/movies section.html', 'utf8');

  const imgRegex = /<img[^>]*alt="([^"]+)"[^>]*src="([^"]+)"/g;
  let movies = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const alt = match[1];
    const src = match[2];
    if (!alt.includes('icon') && !alt.includes('CineVerse') && alt !== 'image' && alt !== 'Profile' && alt !== 'hut' && alt !== 'BookMyShow' && alt !== 'drag_icon' && !alt.includes('Smart Checkout') && alt !== 'close') {
      movies.push({ title: alt, poster: src });
    }
  }

  const uniqueMovies = Array.from(new Map(movies.map(m => [m.title, m])).values());

  console.log(`Seeding ${uniqueMovies.length} movies...`);

  for (const m of uniqueMovies) {
    // Check if it already exists
    const exists = await db.collection('movies').findOne({ title: m.title });
    if (!exists) {
      await db.collection('movies').insertOne({
        title: m.title,
        rating: "8.5",
        votes: "10K",
        formats: ["2D"],
        languages: ["Marathi", "Hindi"],
        duration: "2h 30m",
        genres: ["Comedy", "Drama"],
        certification: "U",
        releaseDate: new Date().toISOString(),
        poster: m.poster,
        about: m.title,
        cast: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  console.log('Seeded successfully!');
  process.exit(0);
}

seed();
