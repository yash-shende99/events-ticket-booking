import { NextResponse } from "next/server";
import { Movie } from "@/models/Movie";
import { Theater } from "@/models/Theater";
import { Showtime } from "@/models/Showtime";
import connectDB from "@/lib/db";

const MOVIES_DB = [
  {
    title: "Dhamaal 4",
    rating: "8.4",
    votes: "45.3K Votes",
    formats: ["2D", "3D"],
    languages: ["Hindi", "Marathi"],
    duration: "2h 20m",
    genres: ["Comedy", "Action"],
    certification: "U/A",
    releaseDate: "24 Oct, 2026",
    poster: "/assets/cast/dhamaal-4-et00452553-1783600284.jpg",
    about: "The iconic comedy franchise returns! Follow the hilarious misadventures of the gang as they embark on a new treasure hunt that takes them across international borders, causing chaos and non-stop laughter along the way.",
    cast: [
      { name: "Ajay Devgn", role: "Actor", image: "/assets/cast/ajay-devgn-24051-12-09-2017-04-41-13.jpg" },
      { name: "Arshad Warsi", role: "Actor", image: "/assets/cast/arshad-warsi-228-14-09-2017-01-59-07.jpg" },
      { name: "Riteish Deshmukh", role: "Actor", image: "/assets/cast/riteish-deshmukh-25378-13-09-2017-04-40-50.jpg" },
      { name: "Javed Jaffrey", role: "Actor", image: "/assets/cast/javed-jaffreyy-940-1741788503.jpg" },
      { name: "Ravi Kishan", role: "Actor", image: "/assets/cast/ravi-kishan-1846-1684385167.jpg" },
      { name: "Sanjay Mishra", role: "Actor", image: "/assets/cast/sanjay-mishra-2041-24-03-2017-12-33-13.jpg" },
      { name: "Upendra Limaye", role: "Actor", image: "/assets/cast/upendra-limaye-9842-1709889454.jpg" }
    ]
  },
  {
    title: "Alpha",
    rating: "8.9",
    votes: "62.1K Votes",
    formats: ["2D", "IMAX 2D"],
    languages: ["Hindi", "Telugu", "Tamil"],
    duration: "2h 45m",
    genres: ["Action", "Thriller"],
    certification: "U/A",
    releaseDate: "25 Dec, 2026",
    poster: "/assets/et00403805-cxrwswcesf-portrait.jpg",
    about: "A highly anticipated action thriller starring the biggest names. When the stakes are high, an elite agent must race against time to prevent a catastrophic event that threatens national security.",
    cast: [
      { name: "Alia Bhatt", role: "Actor", image: "/assets/cast/default-pic.png" },
      { name: "Sharvari Wagh", role: "Actor", image: "/assets/cast/default-pic.png" }
    ]
  },
  {
    title: "Moana",
    rating: "9.2",
    votes: "112K Votes",
    formats: ["2D", "3D", "IMAX 3D", "4DX"],
    languages: ["English", "Hindi"],
    duration: "1h 53m",
    genres: ["Animation", "Adventure", "Comedy"],
    certification: "U",
    releaseDate: "22 Nov, 2026",
    poster: "/assets/et00472951-nzgzdpkuzf-portrait.jpg",
    about: "An adventurous teenager sails out on a daring mission to save her people. During her journey, Moana meets the once-mighty demigod Maui, who guides her in her quest to become a master way-finder.",
    cast: [
      { name: "Auli'i Cravalho", role: "Voice Actor", image: "/assets/cast/default-pic.png" },
      { name: "Dwayne Johnson", role: "Voice Actor", image: "/assets/cast/default-pic.png" }
    ]
  },
  {
    title: "Evil Dead Burn",
    rating: "7.8",
    votes: "24.5K Votes",
    formats: ["2D", "4DX"],
    languages: ["English", "Hindi"],
    duration: "2h 05m",
    genres: ["Horror", "Thriller"],
    certification: "A",
    releaseDate: "13 Nov, 2026",
    poster: "/assets/et00496605-fvycsspxld-portrait.jpg",
    about: "The terrifying franchise returns with a new, blood-curdling chapter. A group of friends discover an ancient book that unleashes malevolent forces, turning their remote getaway into a fight for survival.",
    cast: [
      { name: "Lily Sullivan", role: "Actor", image: "/assets/cast/default-pic.png" },
      { name: "Alyssa Sutherland", role: "Actor", image: "/assets/cast/default-pic.png" }
    ]
  },
  {
    title: "The Odyssey",
    rating: "8.6",
    votes: "88.2K Votes",
    formats: ["2D", "IMAX 2D", "4DX"],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    duration: "2h 32m",
    genres: ["Action", "Sci-Fi", "Adventure"],
    certification: "U/A",
    releaseDate: "05 Dec, 2026",
    poster: "/assets/et00452034-qrgdyxqlhb-portrait.jpg",
    about: "An epic sci-fi adventure that takes humanity beyond the stars. When a mysterious anomaly threatens Earth, a team of astronauts embarks on a perilous journey to uncover the truth and save mankind.",
    cast: [
      { name: "Chris Pratt", role: "Actor", image: "/assets/cast/default-pic.png" },
      { name: "Zoe Saldana", role: "Actor", image: "/assets/cast/default-pic.png" }
    ]
  }
];

const THEATERS_DB = [
  {
    name: "Cinepolis: Nexus Seawoods, Nerul, Navi Mumbai",
    amenities: ["M-Ticket", "Food & Beverage"],
  },
  {
    name: "Cinepolis: Lake Shore, Thane (EX Viviana Mall)",
    amenities: ["M-Ticket"],
  },
  {
    name: "BMX Cinemas(BalajiMovieplex): Littleworld Kharghar",
    amenities: ["M-Ticket", "Food & Beverage"],
  },
  {
    name: "INOX Megaplex: Sky City Mall, Borivali",
    amenities: ["M-Ticket", "Food & Beverage"],
  },
  {
    name: "INOX: R-City, Ghatkopar",
    amenities: ["M-Ticket", "Food & Beverage"],
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});

    // Seed Movies & Theaters
    const insertedMovies = await Movie.insertMany(MOVIES_DB);
    const insertedTheaters = await Theater.insertMany(THEATERS_DB);

    // Generate Showtimes for the next 7 days
    const showtimesToInsert = [];
    const statuses = ["available", "filling", "almost-full"];
    const types = ["Cancellation available", "2K LASER", "ATMOS"];
    const baseTimes = [
      { time: "09:25 AM", isLate: false },
      { time: "12:15 PM", isLate: false },
      { time: "04:30 PM", isLate: false },
      { time: "08:15 PM", isLate: false },
      { time: "11:30 PM", isLate: true },
    ];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      for (const movie of insertedMovies) {
        for (const format of movie.formats) {
          for (const language of movie.languages) {
            for (const theater of insertedTheaters) {
              
              // Add a subset of base times to each theater randomly to add variation
              const numShows = Math.floor(Math.random() * 3) + 2; // 2 to 4 shows
              for (let j = 0; j < numShows; j++) {
                showtimesToInsert.push({
                  movie: movie._id,
                  theater: theater._id,
                  date: dateStr,
                  time: baseTimes[j].time,
                  isLate: baseTimes[j].isLate,
                  format: format,
                  language: language,
                  type: types[Math.floor(Math.random() * types.length)],
                  status: statuses[Math.floor(Math.random() * statuses.length)],
                });
              }

            }
          }
        }
      }
    }

    await Showtime.insertMany(showtimesToInsert);

    return NextResponse.json({ message: "Movies, Theaters, and Showtimes seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
