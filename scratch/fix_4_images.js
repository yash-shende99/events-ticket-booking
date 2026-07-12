const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('events').updateOne({ title: { $regex: 'BABA SURESH' } }, { $set: { poster: '/assets/events/media-desktop-baba-suresh-a-storytelling-special-ft-pulkit-0-2026-5-20-t-8-23-3.jpg' } });
  await db.collection('events').updateOne({ title: { $regex: 'Inder Sahani' } }, { $set: { poster: '/assets/events/media-desktop-inder-sahani-live-a-standup-comedy-show-0-2026-7-3-t-15-56-19.jpg' } });
  await db.collection('events').updateOne({ title: { $regex: 'MaTa Present Abhangwari' } }, { $set: { poster: '/assets/events/media-desktop-mata-present-abhangwari-0-2026-6-13-t-2-30-48.jpg' } });
  await db.collection('events').updateOne({ title: { $regex: 'PRACTICE' } }, { $set: { poster: '/assets/events/media-desktop-practice-a-standup-comedy-show-by-manik-mahna-0-2025-3-5-t-7-5-15.jpg' } });
  console.log('Fixed 4 images');
  process.exit(0);
});
