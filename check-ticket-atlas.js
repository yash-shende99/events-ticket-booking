const mongoose = require('mongoose');

async function checkTicket() {
  await mongoose.connect('mongodb+srv://hvdpvd4:c.i-jGg7ajkfQ3c@cluster0.jbd44.mongodb.net/eventsbooking?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  const tickets = await db.collection('tickets').find().toArray();
  console.log('All tickets:', JSON.stringify(tickets, null, 2));
  process.exit(0);
}

checkTicket();
