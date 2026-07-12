const mongoose = require('mongoose');

async function checkDb() {
  await mongoose.connect('mongodb+srv://hvdpvd4:c.i-jGg7ajkfQ3c@cluster0.jbd44.mongodb.net/eventsbooking?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  const movies = await db.collection('movies').find().toArray();
  console.log('Movies in DB:', movies.map(m => m.title));
  process.exit(0);
}

checkDb();
