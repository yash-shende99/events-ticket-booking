"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Shield, Plus, MonitorPlay, Users, Settings, ArrowLeft, Building2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VenueScreens() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;

  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    capacity: 100,
    categories: [{ name: "Standard", priceMultiplier: 1 }]
  });

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    } else if (status === "authenticated" && venueId) {
      fetchVenue();
    }
  }, [status, session, router, venueId]);

  const fetchVenue = async () => {
    try {
      // Re-using the global theaters API and filtering for this specific one
      const res = await fetch("/api/theaters");
      const data = await res.json();
      if (res.ok) {
        const v = data.find((t: any) => t._id === venueId);
        setVenue(v);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/venues/${venueId}/screens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Screen created successfully!");
        setShowModal(false);
        setFormData({ name: "", capacity: 100, categories: [{ name: "Standard", priceMultiplier: 1 }] });
        fetchVenue();
      } else {
        toast.error(data.error || "Failed to create screen");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteScreen = async (screenId: string) => {
    if (!confirm("Are you sure you want to delete this screen?")) return;
    try {
      const res = await fetch(`/api/admin/venues/${venueId}/screens?screenId=${screenId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Screen deleted");
        fetchVenue();
      } else {
        toast.error("Failed to delete screen");
      }
    } catch (error) {
      toast.error("Error deleting screen");
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Venue Data...</div>;
  }

  if (!venue) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Venue not found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <div className="flex items-center cursor-pointer text-gray-900">
              <span className="text-3xl font-bold tracking-tighter">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <Shield className="w-5 h-5 text-[#f84464]" /> Admin Control
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/venues" className="text-sm font-medium text-gray-600 hover:text-[#f84464] transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Venues
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white shadow-md relative overflow-hidden">
          <Building2 className="absolute -bottom-8 -right-8 w-48 h-48 text-gray-700 opacity-30" />
          <h1 className="text-4xl font-bold tracking-tight relative z-10">{venue.name}</h1>
          <p className="text-gray-300 mt-2 text-lg relative z-10">{venue.address}, {venue.city}</p>
          <div className="flex gap-2 mt-4 relative z-10">
            {venue.amenities.map((a: string, i: number) => (
              <span key={i} className="bg-gray-800 border border-gray-700 text-xs px-3 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Screens & Halls ({venue.screens?.length || 0})</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#f84464] hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-5 h-5" /> Add Screen
          </button>
        </div>

        {!venue.screens || venue.screens.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MonitorPlay className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Screens Added</h3>
            <p className="text-gray-500 mt-2">Add physical halls (e.g., Audi 1, IMAX) to start scheduling events here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venue.screens.map((screen: any) => (
              <div key={screen._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group hover:border-[#f84464] transition">
                <button 
                  onClick={() => handleDeleteScreen(screen._id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-50 text-[#f84464] rounded-lg flex items-center justify-center">
                    <MonitorPlay className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{screen.name}</h3>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" /> {screen.capacity} Seat Capacity
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Seat Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {screen.categories?.map((cat: any, i: number) => (
                      <span key={i} className="bg-white border text-gray-700 text-sm font-bold px-3 py-1 rounded-md shadow-sm">
                        {cat.name} <span className="text-gray-400 font-normal">({cat.priceMultiplier}x base)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Screen</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleCreateScreen} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Screen Name (e.g. Audi 1, IMAX)</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seat Capacity</label>
                <input required type="number" min="1" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
              </div>

              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm flex gap-3 items-start border border-yellow-200">
                <Settings className="w-5 h-5 shrink-0" />
                <p>We are initializing this screen with a default <b>Standard</b> category. In the future Phase 6 (Visual Layout Builder), you will be able to map exact physical seat rows dynamically.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#f84464] hover:bg-red-600 text-white font-bold rounded-lg shadow-sm">Save Screen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
