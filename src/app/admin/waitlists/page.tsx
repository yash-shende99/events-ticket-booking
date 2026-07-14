"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Users, Mail, BellRing, UserPlus, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminWaitlists() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [waitlists, setWaitlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/waitlists")
        .then(res => res.json())
        .then(data => {
          setWaitlists(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  // Group waitlists by showtime
  const groupedWaitlists = waitlists.reduce((acc: any, wl: any) => {
    if (!wl.showtimeId) return acc;
    const key = wl.showtimeId._id;
    if (!acc[key]) {
      acc[key] = {
        showtime: wl.showtimeId,
        entries: [],
        totalSeatsNeeded: 0
      };
    }
    acc[key].entries.push(wl);
    acc[key].totalSeatsNeeded += wl.seatsNeeded;
    return acc;
  }, {});

  const handleNotifyQueue = async (showtimeId: string) => {
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "WAITLIST", 
          audience: "ALL", 
          subject: "Tickets Available!", 
          message: "A spot has opened up for your requested showtime! Login now to claim your seats before they are gone." 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Notification emails triggered for the queue!");
    } catch (error: any) {
      toast.error(error.message || "Failed to notify queue");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading waitlists...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Waitlist Monitoring</h1>
          </div>
          <p className="text-gray-500 ml-12">Monitor demand queues for sold-out or high-demand shows.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.values(groupedWaitlists).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Waitlists</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">There are currently no users waiting in any queues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.values(groupedWaitlists).map((group: any) => (
              <div key={group.showtime._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{group.showtime.movie?.title}</h3>
                    <p className="text-sm text-gray-600 font-medium">{group.showtime.theater?.name} • {group.showtime.theater?.city}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(group.showtime.date).toLocaleDateString()} at {group.showtime.time}
                    </p>
                  </div>
                  <div className="bg-[#f84464] text-white px-3 py-1.5 rounded-lg text-center shadow-sm">
                    <span className="block text-xl font-bold leading-none">{group.entries.length}</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-90">Waiting</span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto max-h-[300px]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" /> Queue Breakdown
                    </h4>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                      Demand: {group.totalSeatsNeeded} Seats
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {group.entries.map((entry: any, index: number) => (
                      <div key={entry._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.email}</p>
                            <p className="text-xs text-gray-500">Requested: <span className="font-semibold text-gray-700">{entry.seatsNeeded} {entry.category} Seats</span></p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toast.success("Force assigning seats functionality coming soon")}
                          className="text-[#f84464] hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Force Assign Seats"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
                  <button 
                    onClick={() => handleNotifyQueue(group.showtime._id)}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <BellRing className="w-4 h-4" /> Notify Queue of Cancellations
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
