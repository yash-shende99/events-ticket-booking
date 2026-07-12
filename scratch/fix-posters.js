const mongoose = require('mongoose');

async function fixPosters() {
  await mongoose.connect('mongodb+srv://hvdpvd4:c.i-jGg7ajkfQ3c@cluster0.jbd44.mongodb.net/eventsbooking?retryWrites=true&w=majority');
  const db = mongoose.connection.db;

  const updates = [
    { title: "Spider-Man: No Way Home", poster: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg" },
    { title: "Dune: Part Two", poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg" },
    { title: "Deadpool & Wolverine", poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Deadpool_%26_Wolverine_poster.jpg" },
    { title: "Avengers: Endgame", poster: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg" },
    { title: "Interstellar", poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg" },
    { title: "Inception", poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg" }
  ];

  for (const u of updates) {
    await db.collection('movies').updateOne(
      { title: u.title },
      { $set: { poster: u.poster } }
    );
  }

  console.log("Updated posters successfully!");
  process.exit(0);
}

fixPosters();
