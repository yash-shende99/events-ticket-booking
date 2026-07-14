"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Map, Calendar, Clock, MapPin, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function SeatMonitoringList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchShowtimes();
    }
  }, [status, session, router]);

  const fetchShowtimes = async () => {
    try {
      const res = await fetch("/api/organiser/showtimes");
      const data = await res.json();
      setShowtimes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load showtimes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Schedules...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Organiser Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/organiser">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold tracking-tighter text-gray-900">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div>
            <h1 className="text-lg font-bold text-gray-700 tracking-tight">Organiser Hub</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/organiser" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-6 h-6 text-[#f84464]" /> Seat Monitoring
              </h1>
              <p className="text-sm text-gray-500">Select a schedule to view real-time seat occupancy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showtimes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No active schedules found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't scheduled any movies yet. Once your venue requests are approved and scheduled by the admin, they will appear here.
            </p>
            <Link href="/organiser/venue-requests/new" className="inline-flex items-center gap-2 px-6 py-3 bg-[#f84464] hover:bg-rose-600 text-white font-bold rounded-xl transition">
              Request a Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showtimes.map((show) => (
              <Link key={show._id} href={`/organiser/seat-monitoring/${show._id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden cursor-pointer group">
                  <div className="p-6">
                    <div className="flex gap-4 mb-4">
                      {show.movie?.posterUrl ? (
                        <img src={show.movie.posterUrl} alt={show.movie.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                          <span className="text-xs">No Poster</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#f84464] transition-colors line-clamp-1">{show.movie?.title || "Unknown Movie"}</h3>
                        <p className="text-xs font-semibold text-gray-500 mb-2">{show.language || "English"} • {show.format || "2D"}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="line-clamp-1">{show.theater?.name || "Unknown Theater"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-xs">{show.screen || "Screen 1"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="w-4 h-4 text-[#f84464]" />
                        {show.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Clock className="w-4 h-4 text-[#f84464]" />
                        {show.time}
                      </div>
                    </div>
                    
                    <div className="mt-4 w-full py-2 bg-rose-50 text-[#f84464] rounded-lg text-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      View Live Seats →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
