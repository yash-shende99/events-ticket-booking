const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({path: '.env.local'});
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const rawData = JSON.parse(fs.readFileSync('scratch/all_titles.json', 'utf8'));
  let count = 0;
  for (let eventData of rawData) {
    if (eventData.title && eventData.poster) {
      let filename = eventData.poster.split('/').pop();
      let localPath = '/assets/events/' + filename;
      
      // Some images were downloaded as media-desktop-title... let's check if the filename exists
      // Wait, the rawData poster is the external URL. 
      // How were they downloaded?
      // In fix_events_assets.js, the agent downloaded them with the name from the URL!
      await db.collection('events').updateOne(
        { title: eventData.title },
        { $set: { poster: localPath } }
      );
      count++;
    }
  }
  console.log('Restored posters for ' + count + ' events');
  process.exit(0);
});
