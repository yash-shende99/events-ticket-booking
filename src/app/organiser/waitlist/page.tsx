"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, Search, CheckCircle2, XCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";

export default function WaitlistManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWaitlist();
    }
  }, [status, session, router]);

  const fetchWaitlist = async () => {
    try {
      const res = await fetch("/api/organiser/waitlist");
      const data = await res.json();
      setWaitlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load waitlist");
    } finally {
      setLoading(false);
    }
  };

  const filteredWaitlist = waitlist.filter((w) => 
    w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (wStatus: string) => {
    if (wStatus === "booked") return <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Converted to Booking</span>;
    if (wStatus === "notified") return <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Mail className="w-3 h-3"/> Offer Sent</span>;
    if (wStatus === "expired") return <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Offer Expired</span>;
    return <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock3 className="w-3 h-3"/> Waiting in Queue</span>;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Waitlist...</div>;

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock3 className="w-6 h-6 text-[#f84464]" /> Premium Waitlist
                </h1>
                <p className="text-sm text-gray-500">Monitor users queued for sold-out events (Read-Only)</p>
              </div>
            </div>
            
            <div className="relative max-w-sm w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#f84464] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  <th className="px-6 py-4">Queue Pos</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Event & Showtime</th>
                  <th className="px-6 py-4 text-center">Seats Requested</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWaitlist.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No waitlist entries found.
                    </td>
                  </tr>
                ) : (
                  filteredWaitlist.map((entry, index) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-400">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{entry.userId?.name || "Guest"}</div>
                        <div className="text-xs text-gray-500">{entry.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 max-w-[200px] truncate">{entry.showtimeId?.movie?.title}</div>
                        <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                          <span>{entry.showtimeId?.date} at {entry.showtimeId?.time}</span>
                          <span>{entry.showtimeId?.theater?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-900">{entry.seatsNeeded}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(entry.status)}
                          {entry.status === "notified" && entry.claimExpiresAt && (
                            <span className="text-[10px] text-gray-500">Expires: {new Date(entry.claimExpiresAt).toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button disabled className="px-4 py-1.5 bg-gray-100 text-gray-400 font-medium rounded-lg text-sm cursor-not-allowed w-full" title="Waitlist automation is handled by Admin">
                          Managed by System
                        </button>
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
