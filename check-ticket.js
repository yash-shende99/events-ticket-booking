const mongoose = require('mongoose');

async function checkTicket() {
  await mongoose.connect('mongodb://localhost:27017/movie-ticket-booking');
  const db = mongoose.connection.db;
  const tickets = await db.collection('tickets').find().toArray();
  console.log('Tickets in DB:', tickets.map(t => t.bookingId));
  process.exit(0);
}

checkTicket();
