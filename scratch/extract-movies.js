const fs = require('fs');

async function extractAndSeed() {
  const html = fs.readFileSync('ref/movies section.html', 'utf8');
  
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const moviesMap = new Map();
  const cards = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/movies/'));
  
  cards.forEach(card => {
    const img = card.querySelector('img');
    const texts = Array.from(card.querySelectorAll('div')).map(d => d.textContent.trim()).filter(t => t.length > 0);
    
    if (img && texts.length >= 1) {
      // Find the longest text chunk that doesn't have a lot of random garbage, usually the title
      // Or just take the first meaningful text node.
      // Actually BookMyShow HTML has specific classes like .sc-7o7nez-0 for titles
      const titleDivs = card.querySelectorAll('.sc-7o7nez-0');
      let title = "Unknown Title";
      let genre = "Action/Drama";
      
      if (titleDivs.length >= 2) {
          title = titleDivs[0].textContent.trim();
          genre = titleDivs[1].textContent.trim();
      } else {
          // fallback
          let rawTexts = texts.filter(t => !t.includes('Promoted') && !t.includes('UA') && t.length > 2);
          if (rawTexts.length >= 1) title = rawTexts[0];
          if (rawTexts.length >= 2) genre = rawTexts[rawTexts.length - 1];
      }

      // Extract image URL, removing query params for cleaner URLs if any, or just keep it
      // The images are local like "./movies section_files/..."
      let posterUrl = img.src.replace('./movies section_files/', '/movies section_files/');
      
      if (!moviesMap.has(title)) {
        let parts = genre.split('/');
        
        moviesMap.set(title, {
            title: title,
            genres: parts.length > 0 ? parts : ["Action", "Drama"],
            poster: posterUrl,
            languages: ["Hindi", "English", "Marathi"],
            duration: "2h 30m",
            formats: ["2D", "3D", "IMAX"],
            rating: (8.5 + (Math.random() * 1.0)).toFixed(1) + "/10",
            votes: Math.floor(Math.random() * 100) + "K Votes",
            certification: "UA16+",
            releaseDate: "24 Oct, 2026",
            about: "Experience the magic of cinema with " + title + ". Get your tickets now on CineVerse!",
            cast: [
              { name: "Lead Actor", role: "Protagonist", image: "https://via.placeholder.com/150" },
              { name: "Supporting Actor", role: "Sidekick", image: "https://via.placeholder.com/150" }
            ]
        });
      }
    }
  });

  const movies = Array.from(moviesMap.values());
  console.log(`Extracted ${movies.length} unique movies.`);
  
  if (movies.length > 0) {
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    dotenv.config({ path: '.env.local' });
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Use the actual schema from src/models/Movie.ts conceptually
    const MovieSchema = new mongoose.Schema({
        title: String,
        rating: String,
        votes: String,
        formats: [String],
        languages: [String],
        duration: String,
        genres: [String],
        certification: String,
        releaseDate: String,
        poster: String,
        about: String,
        cast: [{ name: String, role: String, image: String }]
    });
    const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
    
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log(`Seeded ${movies.length} movies to MongoDB.`);
    
    await mongoose.disconnect();
  }
}

extractAndSeed().catch(console.error);
