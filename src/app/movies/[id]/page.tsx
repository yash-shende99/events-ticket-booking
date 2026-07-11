import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Share2, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookTicketsButton from "@/components/BookTicketsButton";

import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectDB();
  
  let MOVIE;
  try {
    MOVIE = await Movie.findById(resolvedParams.id).lean();
  } catch (error) {
    // Catch invalid ObjectId errors
    MOVIE = null;
  }

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
