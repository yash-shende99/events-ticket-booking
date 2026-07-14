import Image from "next/image";
import Link from "next/link";
import { Share2, Play, Heart, Star } from "lucide-react";
import BookTicketsButton from "@/components/BookTicketsButton";
import { CastSection, CrewSection } from "@/components/CastCrewCards";
import MovieActionsClient from "@/components/movies/MovieActionsClient";
import InterestedButtonClient from "@/components/movies/InterestedButtonClient";
import TrailerPosterClient from "@/components/movies/TrailerPosterClient";

import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectDB();
  
  let MOVIE: any;
  try {
    MOVIE = await Movie.findById(resolvedParams.id).lean();
  } catch {
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

  const formats = (MOVIE.formats || []).filter(Boolean);
  const languages = (MOVIE.languages || []).filter(Boolean);
  // Filter out certification-looking strings from genres
  const genres = (MOVIE.genres || []).filter(
    (g: string) => g && g.length > 1 && !g.match(/^(UA|U|A)\d*[+]?$/)
  );

  // Serialize for client components
  const cast = JSON.parse(JSON.stringify(MOVIE.cast || []));
  const crew = JSON.parse(JSON.stringify(MOVIE.crew || []));

  return (
    <div className="min-h-screen bg-white">
      
      {/* ── HERO SECTION (matches BMS gradient style) ── */}
      <section
        className="relative w-full bg-[#1a1a1a] overflow-hidden"
        style={{ minHeight: 480 }}
      >
        {/* Faint background poster */}
        <div
          className="absolute inset-0 bg-cover bg-top opacity-30"
          style={{ backgroundImage: `url(${MOVIE.poster})` }}
        />
        {/* BMS gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #1A1A1A 24.97%, #1A1A1A 38.3%, rgba(26,26,26,0.04) 97.47%, #1A1A1A 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-10 flex items-start gap-8">
          {/* ── Poster ── */}
          <TrailerPosterClient 
            poster={MOVIE.poster} 
            title={MOVIE.title} 
            releaseDate={MOVIE.releaseDate} 
            trailerUrl={MOVIE.trailerUrl} 
          />

          {/* ── Info ── */}
          <div className="flex flex-col justify-center text-white flex-1 min-w-0 py-2">
            <h1 className="text-[2.2rem] font-bold leading-tight mb-4">{MOVIE.title}</h1>

            {/* Rating + Votes */}
            {MOVIE.rating && (
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition">
                  <Star className="w-5 h-5 text-[#f84464]" fill="currentColor" />
                  <span className="font-bold text-lg">{MOVIE.rating}/10</span>
                  <span className="text-gray-400 text-sm">{MOVIE.votes}</span>
                </div>
                <InterestedButtonClient movieId={MOVIE._id.toString()} />
              </div>
            )}

            {/* Duration • Genres • Certification */}
            <div className="text-gray-300 text-sm mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
              {MOVIE.duration && <span>{MOVIE.duration}</span>}
              {genres.length > 0 && (
                <>
                  <span className="text-gray-600">•</span>
                  <span>{genres.join(", ")}</span>
                </>
              )}
              {MOVIE.certification && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded">
                    {MOVIE.certification}
                  </span>
                </>
              )}
            </div>

            {/* Format & Language tags */}
            {(formats.length > 0 || languages.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formats.map((f: string) => (
                  <span
                    key={f}
                    className="border border-white/50 text-white text-xs px-3 py-1 rounded-full hover:bg-white/10 cursor-pointer transition"
                  >
                    {f}
                  </span>
                ))}
                {languages.map((l: string) => (
                  <span
                    key={l}
                    className="border border-white/30 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-white/10 cursor-pointer transition"
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}

            {/* Book Tickets */}
            <div>
              <BookTicketsButton
                movieId={MOVIE._id.toString()}
                movieTitle={MOVIE.title}
                certification={MOVIE.certification}
                formats={formats}
                languages={languages}
              />
            </div>
          </div>

          <MovieActionsClient movieId={MOVIE._id.toString()} />
        </div>
      </section>

      {/* ── CONTENT BELOW HERO ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">

        {/* About */}
        {MOVIE.about && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About the movie</h2>
            <p className="text-gray-700 leading-relaxed text-sm max-w-3xl">{MOVIE.about}</p>
          </section>
        )}

        {(cast.length > 0 || crew.length > 0) && <hr className="border-gray-100" />}

        {/* Cast — client component handles img errors */}
        <CastSection cast={cast} />

        {/* Crew — client component handles img errors */}
        <CrewSection crew={crew} />

      </div>
    </div>
  );
}
