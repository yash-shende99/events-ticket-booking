import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { User } from "@/models/User";
import { Heart, HeartOff, Star } from "lucide-react";

// Ensure schemas are registered
import "@/models/Movie";
import "@/models/Event";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(session.user.id)
    .populate("wishlistedMovies")
    .populate("wishlistedEvents")
    .lean();

  const movies = user?.wishlistedMovies || [];
  const events = user?.wishlistedEvents || [];
  const totalItems = movies.length + events.length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>

        {totalItems === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <HeartOff className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Save your favorite movies and events by clicking the heart icon on their details page.
            </p>
            <Link href="/">
              <button className="bg-[#f84464] hover:bg-[#e03c5a] text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Explore Experiences
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Movies Section */}
            {movies.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">M</div>
                  Movies
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {movies.map((movie: any) => (
                    <Link href={`/movies/${movie._id}`} key={movie._id}>
                      <div className="group cursor-pointer">
                        <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-3">
                          <Image
                            src={movie.poster.startsWith('http') ? movie.poster : movie.poster.startsWith('//') ? `https:${movie.poster}` : `/${movie.poster.startsWith('/') ? movie.poster.substring(1) : movie.poster}`}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <Heart className="w-4 h-4 text-[#f84464] fill-current" />
                          </div>
                          {movie.rating && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8">
                              <div className="flex items-center gap-1 text-white text-sm font-medium">
                                <Star className="w-4 h-4 text-[#f84464] fill-current" />
                                {movie.rating}/10
                              </div>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#f84464] transition-colors truncate">{movie.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{movie.certification || 'U/A'} • {movie.languages?.[0] || 'Hindi'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Events Section */}
            {events.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">E</div>
                  Events & Plays
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {events.map((event: any) => (
                    <Link href={`/events/${event._id}`} key={event._id}>
                      <div className="group cursor-pointer">
                        <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-3">
                          <Image
                            src={event.poster.startsWith('http') ? event.poster : event.poster.startsWith('//') ? `https:${event.poster}` : `/${event.poster.startsWith('/') ? event.poster.substring(1) : event.poster}`}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <Heart className="w-4 h-4 text-[#f84464] fill-current" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 pt-8">
                            <div className="flex items-center gap-1 text-white text-xs font-medium uppercase tracking-wider">
                              {event.date?.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#f84464] transition-colors line-clamp-2 leading-tight mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{event.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
