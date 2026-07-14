"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, Check, X, Clock, MapPin, Film, User, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminVenueRequests() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchRequests();
    }
  }, [status, session, router]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/venue-requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/venue-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Request ${newStatus.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading requests...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Venue Requests</h1>
              <p className="text-sm text-gray-500">Review screening requests from Event Organisers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-500 max-w-md mx-auto">There are no venue requests from organisers at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map(req => {
              const screenName = req.venueId?.screens?.find((s:any) => s._id === req.screenId)?.name || (req.screenId === 'Any' ? 'Any Available Screen' : 'Unknown Screen');
              
              return (
                <div key={req._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column: Movie & Organiser Info */}
                  <div className="flex gap-4 md:w-1/3">
                    {req.movieId?.poster ? (
                      <img src={req.movieId.poster} alt="" className="w-24 h-36 object-cover rounded shadow-sm bg-gray-100" />
                    ) : (
                      <div className="w-24 h-36 rounded bg-gray-100 flex items-center justify-center">
                        <Film className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{req.movieId?.title || "Unknown Event"}</h3>
                      <div className="space-y-1 mt-3">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Organiser</p>
                        <p className="text-sm text-gray-800 font-medium flex items-center gap-1"><User className="w-3 h-3"/> {req.organiserId?.name}</p>
                        <p className="text-xs text-gray-500">{req.organiserId?.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Request Details */}
                  <div className="flex-1 space-y-4 md:border-l md:border-gray-100 md:pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Requested Venue</p>
                        <p className="font-medium text-gray-900">{req.venueId?.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {req.venueId?.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Screen / Hall</p>
                        <p className="font-medium text-gray-900">{screenName}</p>
                        <p className="text-sm text-gray-500">Cap Required: {req.capacityRequested}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Requested Schedule</p>
                      <p className="text-sm text-gray-900 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400"/>
                        {new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    {req.message && (
                      <div className="text-sm text-gray-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                        <span className="font-bold text-amber-800 text-xs uppercase block mb-1">Message:</span>
                        {req.message}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="md:w-48 flex flex-col justify-center gap-3 md:border-l md:border-gray-100 md:pl-6">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                      {req.status === "Pending" && <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                      {req.status === "Approved" && <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"><Check className="w-3 h-3"/> Approved</span>}
                      {req.status === "Rejected" && <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1"><X className="w-3 h-3"/> Rejected</span>}
                    </div>

                    {req.status === "Pending" && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(req._id, "Approved")}
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm transition flex justify-center items-center gap-2 text-sm"
                        >
                          <Check className="w-4 h-4"/> Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req._id, "Rejected")}
                          className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4"/> Reject
                        </button>
                      </>
                    )}
                    
                    {req.status === "Approved" && (
                      <Link 
                        href={`/admin/schedule?movieId=${req.movieId?._id}&venueId=${req.venueId?._id}&screenId=${req.screenId}`}
                        className="w-full py-2 mt-2 bg-[#f84464] hover:bg-rose-600 text-white font-bold rounded-xl shadow-sm transition flex justify-center items-center gap-2 text-sm text-center"
                      >
                        <Calendar className="w-4 h-4"/> Schedule Now
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
