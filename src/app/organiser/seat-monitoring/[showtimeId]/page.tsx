"use client";

import { useState, use, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Square, Map, Users } from "lucide-react";
import toast from "react-hot-toast";
import SeatLayoutGrid from "@/components/buytickets/SeatLayoutGrid";
import UserMenuClient from "@/components/UserMenuClient";

export default function SeatVisualizerPage({ params: paramsPromise }: { params: Promise<{ showtimeId: string }> }) {
  const params = use(paramsPromise);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [heldSeats, setHeldSeats] = useState<string[]>([]);
  const [layout, setLayout] = useState<string[][]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSeatStatus();
    }
  }, [status, session, router, params.showtimeId]);

  const fetchSeatStatus = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/showtimes/${params.showtimeId}/seats-status`);
      const data = await res.json();
      if (data.success) {
        setBookedSeats(data.bookedSeats || []);
        setHeldSeats(data.heldSeats || []);
        if (data.layout) setLayout(data.layout);
        if (data.categories) setCategories(data.categories);
      } else {
        toast.error("Failed to load seat layout");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch seat data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Seat Map...</div>;

  const totalSeats = layout.length > 0 ? layout.flat().filter(s => s !== '0').length : 200; // Mock 200 if no layout
  const occupiedSeats = bookedSeats.length + heldSeats.length;
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

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
          <Link href="/organiser/seat-monitoring" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Schedules
          </Link>
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/organiser/seat-monitoring" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Seat Map</h1>
                <p className="text-sm text-gray-500">Real-time occupancy monitoring</p>
              </div>
            </div>
            
            <button 
              onClick={fetchSeatStatus}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm transition"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-sm text-gray-600"><Square className="w-4 h-4 text-white fill-white stroke-gray-300"/> Available</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Square className="w-4 h-4 text-[#f84464] fill-[#f84464] opacity-50"/> Held / In Cart</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Square className="w-4 h-4 text-gray-300 fill-gray-300"/> Booked</div>
              </div>
              <div className="p-8 overflow-x-auto min-h-[400px]">
                {/* Visualizer Mode: maxSeats=0, no interactivity */}
                <div className="pointer-events-none opacity-90 scale-95 origin-top">
                  <SeatLayoutGrid 
                    maxSeats={0}
                    selectedSeats={[]}
                    bookedSeats={bookedSeats}
                    heldSeats={heldSeats}
                    layout={layout}
                    categories={categories}
                    onSeatSelect={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#f84464]" /> Occupancy Stats
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Fill Rate</span>
                    <span className="font-bold text-gray-900">{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#f84464] h-2 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Booked</p>
                    <p className="text-2xl font-bold text-gray-900">{bookedSeats.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Held</p>
                    <p className="text-2xl font-bold text-amber-500">{heldSeats.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">View-Only Mode</h3>
              <p className="text-sm text-blue-800">
                Organizers have read-only access to venue seating. Manual blocking, reserving, or overriding seats is managed exclusively by Venue Administrators to prevent operational conflicts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
