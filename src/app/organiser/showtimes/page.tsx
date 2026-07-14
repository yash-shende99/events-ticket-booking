"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Monitor } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";

export default function ShowtimesDirectory() {
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

  // Sort showtimes by date and time
  const sortedShowtimes = [...showtimes].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Showtimes...</div>;

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
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
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
                <Calendar className="w-6 h-6 text-[#f84464]" /> Upcoming Showtimes
              </h1>
              <p className="text-sm text-gray-500">A comprehensive directory of all your scheduled screenings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Event / Movie</th>
                  <th className="px-6 py-4">Venue & Screen</th>
                  <th className="px-6 py-4">Format & Language</th>
                  <th className="px-6 py-4 text-center">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedShowtimes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <p className="text-gray-500">No upcoming showtimes found.</p>
                    </td>
                  </tr>
                ) : (
                  sortedShowtimes.map((showtime) => (
                    <tr key={showtime._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" /> {new Date(showtime.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4" /> {showtime.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{showtime.movie?.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <MapPin className="w-4 h-4 text-gray-400" /> {showtime.theater?.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Monitor className="w-4 h-4" /> Screen: {showtime.screen}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                            {showtime.format}
                          </span>
                          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                            {showtime.language}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        ₹{showtime.pricing?.standard || showtime.pricing?.economy || showtime.pricing?.premium || 300}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
