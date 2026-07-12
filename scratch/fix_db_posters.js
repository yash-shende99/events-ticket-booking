const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false, collection: 'events' }));
  const events = await Event.find({}).lean();
  let count = 0;
  for (let e of events) {
    if (e.poster && typeof e.poster === 'string' && e.poster.includes('bmscdn')) {
      const filename = e.poster.split('/').pop();
      await Event.updateOne({_id: e._id}, {$set: {poster: '/assets/events/' + filename}});
      count++;
    }
  }
  console.log('Fixed posters for ' + count + ' events');
  process.exit(0);
});
