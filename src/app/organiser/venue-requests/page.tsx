"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenuClient from "@/components/UserMenuClient";
import { ArrowLeft, Plus, Calendar, Clock, MapPin, Film, Building2, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import toast from "react-hot-toast";

export default function VenueRequests() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchRequests();
    }
  }, [status, session, router]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/organiser/venue-requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load venue requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (reqStatus: string) => {
    if (reqStatus === "Approved") return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span>;
    if (reqStatus === "Rejected") return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>;
    return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock3 className="w-3 h-3"/> Pending</span>;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
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
Loading Requests...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Venue Requests</h1>
                <p className="text-sm text-gray-500">Manage your screening requests to theaters</p>
              </div>
            </div>
            <Link 
              href="/organiser/venue-requests/new"
              className="px-4 py-2 bg-[#f84464] hover:bg-rose-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Request
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Venue Requests Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't requested any venues for your events yet. Create a new request to start scheduling.</p>
            <Link 
              href="/organiser/venue-requests/new"
              className="px-6 py-3 bg-[#f84464] hover:bg-rose-600 text-white font-bold rounded-xl shadow-sm inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create First Request
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Movie / Event</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Venue</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Dates Requested</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Requested On</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {req.movieId?.poster ? (
                          <img src={req.movieId.poster} alt="" className="w-10 h-14 rounded object-cover shadow-sm bg-gray-200" />
                        ) : (
                          <div className="w-10 h-14 rounded bg-gray-100 flex items-center justify-center">
                            <Film className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{req.movieId?.title || "Unknown Movie"}</p>
                          <p className="text-xs text-gray-500">Requested Cap: {req.capacityRequested}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{req.venueId?.name || "Unknown Venue"}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {req.venueId?.city || "Unknown City"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-gray-900 flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400"/> {new Date(req.startDate).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-xs text-center">to</p>
                        <p className="text-gray-900 flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400"/> {new Date(req.endDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
