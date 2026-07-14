"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Calendar, Clock, MapPin, Search, ArrowLeft, MoreVertical, Trash2 } from "lucide-react";

export default function AdminSchedulesOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/schedules")
        .then(res => res.json())
        .then(data => {
          setShowtimes(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const filteredShowtimes = showtimes.filter(s => {
    const movieMatch = s.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const venueMatch = s.theater?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return movieMatch || venueMatch;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading schedules...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Overview</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by movie or venue..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Link 
              href="/admin/schedule"
              className="w-full sm:w-auto px-6 py-2 bg-[#f84464] hover:bg-red-600 text-white font-medium rounded-xl transition-all shadow-sm whitespace-nowrap text-center"
            >
              + Deploy New Schedule
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredShowtimes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No schedules found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't deployed any active showtimes yet, or your search didn't match anything.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Movie</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Venue & Screen</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date & Time</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredShowtimes.map((show) => (
                    <tr key={show._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{show.movie?.title || "Unknown Movie"}</p>
                            <p className="text-xs text-gray-500">{show.format} • {show.language}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {show.isEvent ? (
                          <>
                            <p className="font-medium text-gray-900">{show.eventLocation || "Custom Location"}</p>
                            <p className="text-sm text-gray-500">Event Venue</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900">{show.theater?.name || "Unknown Venue"}</p>
                            <p className="text-sm text-gray-500">{show.screen} • {show.theater?.city}</p>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            {new Date(show.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-orange-500" />
                            {show.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                          {show.status || "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
