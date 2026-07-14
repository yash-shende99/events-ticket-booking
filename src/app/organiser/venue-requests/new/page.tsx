"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenuClient from "@/components/UserMenuClient";
import { ArrowLeft, Building2, MapPin, Film, Users, Calendar, MessageSquare, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function NewVenueRequest() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    movieId: "",
    eventLocation: "",
    venueId: "",
    screenId: "",
    startDate: "",
    endDate: "",
    capacityRequested: "",
    message: ""
  });

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      // Fetch Organiser's Movies
      const moviesRes = await fetch("/api/organiser/movies");
      const moviesData = await moviesRes.json();
      
      // Fetch All Venues
      const venuesRes = await fetch("/api/theaters", { cache: "no-store" });
      const venuesData = await venuesRes.json();

      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setVenues(Array.isArray(venuesData) ? venuesData : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load necessary data");
    } finally {
      setLoading(false);
    }
  };

  const selectedMovie = movies.find(m => m._id === formData.movieId);
  const isEvent = selectedMovie?.eventType === "Event";
  const selectedVenue = venues.find(v => v._id === formData.venueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        movieId: formData.movieId,
        isEvent: isEvent,
        startDate: formData.startDate,
        endDate: formData.endDate,
        capacityRequested: Number(formData.capacityRequested),
        message: formData.message,
      };

      if (isEvent) {
        payload.eventLocation = formData.eventLocation;
      } else {
        payload.venueId = formData.venueId;
        payload.screenId = formData.screenId;
      }

      const res = await fetch("/api/organiser/venue-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Venue Request submitted successfully!");
      router.push("/organiser/venue-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
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
Loading form...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/organiser/venue-requests" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request a Venue</h1>
              <p className="text-sm text-gray-500">Submit a scheduling request to a theater partner</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Film className="w-5 h-5 text-[#f84464]" /> 1. Select Your Event
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which movie/event do you want to screen?</label>
              <select
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                value={formData.movieId}
                onChange={e => setFormData({ ...formData, movieId: e.target.value })}
              >
                <option value="">-- Select Listing --</option>
                {movies.map(m => (
                  <option key={m._id} value={m._id}>{m.title} ({m.eventType || 'Movie'})</option>
                ))}
              </select>
              {movies.length === 0 && (
                <p className="text-sm text-red-500 mt-2">You haven't created any listings yet. Please create one first.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#f84464]" /> 2. {isEvent ? 'Event Location' : 'Choose Venue & Screen'}
            </h2>
            
            {isEvent ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Central Park, NY or The Grand Arena"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                    value={formData.eventLocation}
                    onChange={e => setFormData({ ...formData, eventLocation: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Venue</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                    value={formData.venueId}
                    onChange={e => setFormData({ ...formData, venueId: e.target.value, screenId: "" })}
                  >
                    <option value="">-- Browse Venues --</option>
                    {venues.map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.city})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Screen / Hall</label>
                  <select
                    required
                    disabled={!formData.venueId}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={formData.screenId}
                    onChange={e => setFormData({ ...formData, screenId: e.target.value })}
                  >
                    <option value="">-- Select Screen --</option>
                    {selectedVenue?.screens?.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name} (Cap: {s.capacity || 'N/A'})</option>
                    ))}
                    <option value="Any">Any Available Screen</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#f84464]" /> 3. Schedule & Capacity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400"/> Requested Capacity (Seats per show)</div>
              </label>
              <input
                type="number"
                required
                min="10"
                placeholder="e.g. 150"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                value={formData.capacityRequested}
                onChange={e => setFormData({ ...formData, capacityRequested: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-gray-400"/> Additional Requirements (Optional)</div>
              </label>
              <textarea
                rows={3}
                placeholder="Any special requests, promotional plans, or specific showtime preferences..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none resize-none"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting || movies.length === 0}
              className="px-8 py-3 bg-[#f84464] hover:bg-rose-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Submit Request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
