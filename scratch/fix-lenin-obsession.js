const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));
  
  // Set Lenin exactly as the screenshot
  await Movie.updateOne(
    { title: 'Lenin' },
    { $set: { 
        about: "Lenin is a powerful Tamil drama that delves into the life of a man whose convictions put him at odds with society.",
        cast: [
          { name: "Vijay Sethupathi", role: "Lenin", image: null },
          { name: "Sundarapandian", role: "Actor", image: null }
        ],
        crew: []
      } 
    }
  );

  // Set Obsession exactly as the screenshot
  await Movie.updateOne(
    { title: 'Obsession' },
    { $set: { 
        about: "Obsession is a psychological thriller about a woman whose perfect life begins to unravel when a stranger from her past returns.",
        cast: [
          { name: "Shilpa Shetty", role: "Actor", image: null },
          { name: "Rohit Bose Roy", role: "Actor", image: null }
        ],
        crew: []
      } 
    }
  );
  
  console.log("✅ Fixed Lenin and Obsession perfectly.");
  
  process.exit(0);
}

main().catch(console.error);
