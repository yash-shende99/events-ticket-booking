"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Shield, Building2, ChevronRight, LayoutDashboard, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminVenues() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    amenities: "Parking, Cafeteria"
  });

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchVenues();
    }
  }, [status, session, router]);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/admin/venues");
      const data = await res.json();
      if (res.ok) {
        setVenues(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amenities: formData.amenities.split(",").map(a => a.trim()).filter(a => a)
      };

      const res = await fetch("/api/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Venue created successfully!");
        setShowModal(false);
        setFormData({ name: "", city: "", address: "", amenities: "Parking, Cafeteria" });
        fetchVenues();
      } else {
        toast.error(data.error || "Failed to create venue");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Venues...</div>;
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
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-[#f84464] transition bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-lg">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
            <p className="text-gray-500 mt-1">Manage physical theaters, cinemas, and multiplexes across cities.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#f84464] hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-5 h-5" /> Add New Venue
          </button>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Venues Found</h3>
            <p className="text-gray-500 mt-2">You haven't added any physical theaters to the platform yet.</p>
            <button onClick={() => setShowModal(true)} className="mt-6 text-[#f84464] font-bold hover:underline">
              Create your first venue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 p-6 flex flex-col justify-end relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {venue.screens?.length || 0} Screens
                  </div>
                  <h3 className="text-2xl font-bold text-white truncate">{venue.name}</h3>
                  <p className="text-gray-300 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {venue.city}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{venue.address}</p>
                  
                  <Link href={`/admin/venues/${venue._id}/screens`}>
                    <button className="w-full py-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-[#f84464] border border-gray-200 hover:border-red-200 rounded-lg font-bold flex items-center justify-center gap-2 transition">
                      <LayoutDashboard className="w-4 h-4" /> Manage Screens & Layouts
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Venue Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Venue</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleCreateVenue} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name (e.g. PVR Cinemas)</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3}></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                  value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#f84464] hover:bg-red-600 text-white font-bold rounded-lg shadow-sm">Create Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
