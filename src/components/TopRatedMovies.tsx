import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";

export default async function TopRatedMovies() {
  await connectDB();
  const movies = await Movie.find({ eventType: { $ne: "Event" } }).sort({ rating: -1 }).limit(10).lean();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Rated Movies</h2>
        <Link href="/movies" className="flex items-center text-[#dc3558] hover:text-[#b82947] text-sm font-semibold transition">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
        {movies.map((movie: any) => (
          <Link key={movie._id.toString()} href={`/movies/${movie._id}`} className="group shrink-0 w-[200px] snap-start flex flex-col gap-2 cursor-pointer">
            <div className="w-full h-[300px] relative rounded-xl overflow-hidden shadow-md bg-gray-200">
              <Image 
                src={movie.poster} 
                alt={movie.title} 
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />
              {/* Rating overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#f84464] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-white text-sm font-bold">{movie.rating}</span>
                  <span className="text-white/70 text-xs">{movie.votes}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base text-gray-900 line-clamp-1">{movie.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{(movie.genres || []).join("/")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
