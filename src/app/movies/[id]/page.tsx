import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Share2, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookTicketsButton from "@/components/BookTicketsButton";

const MOVIES_DB: Record<string, any> = {
  "1": {
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
  "2": {
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
  "3": {
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
  "4": {
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
  "5": {
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
};

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const MOVIE = MOVIES_DB[resolvedParams.id];

  if (!MOVIE) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
        <Link href="/" className="text-[#f84464] hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative w-full h-[480px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(90deg, #1A1A1A 24.97%, #1A1A1A 38.3%, rgba(26, 26, 26, 0.04) 97.47%, #1A1A1A 100%), url(${MOVIE.poster})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full flex gap-8 z-10">
          {/* Poster Container */}
          <div className="relative w-[260px] shrink-0">
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-700/50 relative group cursor-pointer">
              <Image 
                src={MOVIE.poster}
                alt={MOVIE.title}
                width={260}
                height={390}
                className="w-full h-auto object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                </div>
                <span className="text-white font-medium text-sm mt-2">Trailer</span>
              </div>
            </div>
          </div>

          {/* Details Container */}
          <div className="flex flex-col justify-center py-4 text-white flex-1">
            <h1 className="text-[36px] font-bold tracking-tight mb-4">{MOVIE.title}</h1>
            
            {/* Rating Box */}
            <div className="flex items-center gap-4 bg-[#333333]/80 backdrop-blur-md rounded-xl p-4 w-max mb-6 cursor-pointer hover:bg-[#333333] transition">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-[#f84464]" fill="currentColor" />
                <span className="text-xl font-bold">{MOVIE.rating}/10</span>
                <span className="text-gray-300 text-sm">{MOVIE.votes}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-2" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/90 text-black px-3 py-1 text-sm font-semibold rounded-sm cursor-pointer hover:underline">
                {MOVIE.formats.join(", ")}
              </div>
              <div className="bg-white/90 text-black px-3 py-1 text-sm font-semibold rounded-sm cursor-pointer hover:underline">
                {MOVIE.languages.join(", ")}
              </div>
            </div>

            {/* Meta info */}
            <div className="text-gray-300 text-base mb-8">
              <span>{MOVIE.duration}</span>
              <span className="mx-2">•</span>
              <span>{MOVIE.genres.join(", ")}</span>
              <span className="mx-2">•</span>
              <span>{MOVIE.certification}</span>
              <span className="mx-2">•</span>
              <span>{MOVIE.releaseDate}</span>
            </div>

            {/* Book Button */}
            <BookTicketsButton 
              movieTitle={MOVIE.title}
              certification={MOVIE.certification}
              formats={MOVIE.formats}
              languages={MOVIE.languages}
            />
          </div>
          
          {/* Share Button Top Right */}
          <div className="absolute top-8 right-8">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition border border-white/20">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 w-full flex flex-col gap-10">
        
        {/* About Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the movie</h2>
          <p className="text-gray-700 leading-relaxed text-base">
            {MOVIE.about}
          </p>
        </section>



        {/* Cast Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cast</h2>
          <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
            {MOVIE.cast.map((actor, idx) => (
              <div key={idx} className="flex flex-col items-center shrink-0 w-28 snap-start cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border border-gray-200 group-hover:shadow-md transition">
                  <Image 
                    src={actor.image}
                    alt={actor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-1">{actor.name}</h3>
                <p className="text-xs text-gray-500 text-center">{actor.role}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />
        
        {/* Crew Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crew</h2>
          <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
             <div className="flex flex-col items-center shrink-0 w-28 snap-start cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border border-gray-200 bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                   <span className="text-gray-400 font-bold text-xl">IK</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-1">Indra Kumar</h3>
                <p className="text-xs text-gray-500 text-center">Director</p>
              </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
