import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const MOVIES = [
  {
    id: 1,
    title: "Dhamaal 4",
    genre: "Comedy",
    image: "/assets/et00452553-ahtvqhdary-portrait.jpg"
  },
  {
    id: 2,
    title: "Alpha",
    genre: "Action/Thriller",
    image: "/assets/et00403805-cxrwswcesf-portrait.jpg"
  },
  {
    id: 3,
    title: "Moana",
    genre: "Animation/Adventure",
    image: "/assets/et00472951-nzgzdpkuzf-portrait.jpg"
  },
  {
    id: 4,
    title: "Evil Dead Burn",
    genre: "Horror",
    image: "/assets/et00496605-fvycsspxld-portrait.jpg"
  },
  {
    id: 5,
    title: "The Odyssey",
    genre: "Action/Sci-Fi",
    image: "/assets/et00452034-qrgdyxqlhb-portrait.jpg"
  }
];

export default function RecommendedMovies() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recommended Movies</h2>
        <Link href="/movies" className="flex items-center text-[#dc3558] hover:text-[#b82947] text-sm font-semibold transition">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
        {MOVIES.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="group shrink-0 w-[220px] snap-start flex flex-col gap-3 cursor-pointer">
            <div className="w-full rounded-lg overflow-hidden shadow-md">
              {/* Removing 'fill' and 'object-cover' to prevent the baked-in rating bar at the bottom from being cropped */}
              <Image 
                src={movie.image} 
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
              <p className="text-gray-500 text-sm mt-1">{movie.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
