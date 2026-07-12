const mongoose = require('mongoose');

async function fixDb() {
  await mongoose.connect('mongodb+srv://hvdpvd4:c.i-jGg7ajkfQ3c@cluster0.jbd44.mongodb.net/eventsbooking?retryWrites=true&w=majority');
  const db = mongoose.connection.db;

  const validMovies = ['Dhamaal 4', 'Alpha', 'Moana', 'Evil Dead Burn', 'The Odyssey', 'Welcome To The Jungle'];

  // Delete all movies that are not in the valid list
  const deleteResult = await db.collection('movies').deleteMany({
    title: { $nin: validMovies }
  });
  console.log(`Deleted ${deleteResult.deletedCount} events/invalid movies.`);

  // Let's add some actual popular movies to fill out the grid!
  const newMovies = [
    {
      title: "Avengers: Endgame",
      rating: "9.5",
      votes: "1.2M",
      formats: ["2D", "3D", "IMAX 3D"],
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      genres: ["Action", "Sci-Fi", "Adventure"],
      certification: "U/A",
      poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg",
    },
    {
      title: "Interstellar",
      rating: "9.8",
      votes: "980K",
      formats: ["IMAX 2D", "2D"],
      languages: ["English", "Hindi"],
      genres: ["Sci-Fi", "Adventure", "Drama"],
      certification: "U",
      poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    },
    {
      title: "Inception",
      rating: "9.3",
      votes: "850K",
      formats: ["2D", "IMAX 2D"],
      languages: ["English", "Hindi"],
      genres: ["Action", "Sci-Fi", "Thriller"],
      certification: "U/A",
      poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    },
    {
      title: "Spider-Man: No Way Home",
      rating: "9.1",
      votes: "1.5M",
      formats: ["2D", "3D", "4DX"],
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      genres: ["Action", "Adventure", "Sci-Fi"],
      certification: "U/A",
      poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjBi00Zjc2LA@@._V1_FMjpg_UX1000_.jpg",
    },
    {
      title: "The Dark Knight",
      rating: "9.9",
      votes: "2.1M",
      formats: ["2D", "IMAX 2D"],
      languages: ["English", "Hindi"],
      genres: ["Action", "Crime", "Drama"],
      certification: "U/A",
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    },
    {
      title: "Oppenheimer",
      rating: "9.0",
      votes: "600K",
      formats: ["IMAX 2D", "2D"],
      languages: ["English", "Hindi"],
      genres: ["Biography", "Drama", "History"],
      certification: "A",
      poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    },
    {
      title: "Dune: Part Two",
      rating: "9.4",
      votes: "450K",
      formats: ["IMAX 2D", "2D", "4DX"],
      languages: ["English", "Hindi"],
      genres: ["Action", "Adventure", "Sci-Fi"],
      certification: "U/A",
      poster: "https://m.media-amazon.com/images/M/MV5BODQ0ZThhMmUtYWKyOS00YTE1LTg1ODAtNTBhMGI1MGE1NDAxXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_.jpg",
    },
    {
      title: "Deadpool & Wolverine",
      rating: "9.2",
      votes: "800K",
      formats: ["3D", "IMAX 3D", "2D"],
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      genres: ["Action", "Comedy", "Sci-Fi"],
      certification: "A",
      poster: "https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTQ1Mi00Y2Q5LWEwM2MtMzUwZDVjNjQwYmNlXkEyXkFqcGdeQXVyMTU2NTcyNjE3._V1_.jpg",
    }
  ];

  for (const m of newMovies) {
    const exists = await db.collection('movies').findOne({ title: m.title });
    if (!exists) {
      await db.collection('movies').insertOne({
        ...m,
        duration: "2h 30m",
        releaseDate: new Date().toISOString(),
        about: m.title,
        cast: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  console.log(`Inserted ${newMovies.length} real movies.`);
  process.exit(0);
}

fixDb();
