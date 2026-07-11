import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";

export default async function RecommendedMovies() {
  await connectDB();
  const movies = await Movie.find({}).lean();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recommended Movies</h2>
        <Link href="/movies" className="flex items-center text-[#dc3558] hover:text-[#b82947] text-sm font-semibold transition">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
        {movies.map((movie: any) => (
          <Link key={movie._id.toString()} href={`/movies/${movie._id}`} className="group shrink-0 w-[220px] snap-start flex flex-col gap-3 cursor-pointer">
            <div className="w-full rounded-lg overflow-hidden shadow-md">
              {/* Removing 'fill' and 'object-cover' to prevent the baked-in rating bar at the bottom from being cropped */}
              <Image 
                src={movie.poster} 
                alt={movie.title} 
                width={220}
                height={330}
                className="w-full h-auto object-contain group-hover:scale-105 transition duration-300"
                style={{ width: '100%', height: 'auto' }}
                unoptimized
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{movie.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{movie.genres.join("/")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
