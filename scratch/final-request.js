const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Movie = mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({}, { strict: false }));

  // 1. Delete Aajo Ardhangini and Main Vaapas Aaunga
  await Movie.deleteMany({ title: { $in: ['Aajo Ardhangini', 'Main Vaapas Aaunga'] } });
  console.log('✅ Deleted Aajo Ardhangini and Main Vaapas Aaunga');

  // 2. Cocktail 2
  // Make its cast exactly what was in its _files folder
  const cocktail2Cast = [
    { name: 'Shahid Kapoor', role: 'Actor', image: '/assets/cast/shahid-kapoor-2094-1680754317.jpg' },
    { name: 'Rashmika Mandanna', role: 'Actor', image: '/assets/cast/rashmika-mandanna-1076783-28-12-2016-12-20-39.jpg' },
    { name: 'Kriti Sanon', role: 'Actor', image: '/assets/cast/kriti-sanon-37438-15-09-2017-03-51-03.jpg' }
  ];
  const cocktail2Crew = [
    { name: 'Homi Adajania', role: 'Director', image: '/assets/cast/homi-adajania-826-19-09-2017-03-00-43.jpg' },
    { name: 'Dinesh Vijan', role: 'Producer', image: '/assets/cast/dinesh-vijan-1070169-02-05-2017-10-33-25.jpg' },
    { name: 'Luv Ranjan', role: 'Producer', image: '/assets/cast/luv-ranjan-23562-19-02-2018-04-07-48.jpg' },
    { name: 'Ankur Garg', role: 'Producer', image: '/assets/cast/ankur-garg-1085948-1743259423.jpg' }
  ];
  await Movie.updateOne(
    { title: 'Cocktail 2' },
    { $set: { 
        about: "Cocktail 2 brings back the magic of romance, friendship, and heartbreak in a fresh new story.",
        cast: cocktail2Cast, 
        crew: cocktail2Crew,
        isFeatured: true
      } 
    }
  );
  console.log('✅ Cocktail 2 details perfected');

  // 3. The Invite
  // Real cast of The Invite
  const inviteCast = [
    { name: 'Nathalie Emmanuel', role: 'Evie', image: null },
    { name: 'Thomas Doherty', role: 'Walter', image: null },
    { name: 'Sean Pertwee', role: 'Mr. Field', image: null },
    { name: 'Hugh Skinner', role: 'Oliver', image: null },
    { name: 'Carol Ann Crawford', role: 'Mrs. Swift', image: null },
    { name: 'Alana Boden', role: 'Lucy', image: null }
  ];
  await Movie.updateOne(
    { title: 'The Invite' },
    { $set: { 
        about: "After the death of her mother and having no other known relatives, Evie takes a DNA test and discovers a long-lost cousin she never knew she had. Invited by her newfound family to a lavish wedding in the English countryside, she's at first seduced by the aristocratic host.",
        cast: inviteCast, 
        crew: [],
        isFeatured: true
      } 
    }
  );
  console.log('✅ The Invite details perfected');

  // 4. Obsession
  // Already fixed previously, but let's ensure it's marked as featured and has perfect info
  await Movie.updateOne(
    { title: 'Obsession' },
    { $set: { 
        about: "Obsession is a psychological thriller about a woman whose perfect life begins to unravel when a stranger from her past returns.",
        cast: [
          { name: "Shilpa Shetty", role: "Actor", image: null },
          { name: "Rohit Bose Roy", role: "Actor", image: null }
        ],
        crew: [],
        isFeatured: true
      } 
    }
  );
  console.log('✅ Obsession details perfected');

  process.exit(0);
}

main().catch(console.error);
