import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";

export default async function FamilyFriendly() {
  await connectDB();
  const movies = await Movie.find({ certification: { $in: ["U", "UA"] } }).sort({ _id: -1 }).limit(10).lean();

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Family Friendly Movies</h2>
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
                  <span className="text-white text-sm font-bold border border-white/50 px-1 rounded">{movie.certification}</span>
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
