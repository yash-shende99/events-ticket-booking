"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Plus, Trash2, Save, LayoutDashboard, Film, Loader2, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCMS() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState("");
  
  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<string[]>([]); // Storing ObjectIds

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchCMS();
      fetchMovies();
    }
  }, [status, session, router]);

  const fetchCMS = async () => {
    try {
      const res = await fetch("/api/admin/cms");
      const data = await res.json();
      if (data) {
        setBanners(data.homepageBanners || []);
        // Map populated objects back to IDs for the edit state
        setFeaturedMovies(data.featuredMovies?.map((m: any) => typeof m === 'object' ? m._id : m) || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBanner = () => {
    if (!newBanner) return;
    if (!newBanner.startsWith("http")) return toast.error("Must be a valid URL");
    setBanners([...banners, newBanner]);
    setNewBanner("");
  };

  const handleRemoveBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  const handleToggleFeatured = (movieId: string) => {
    if (featuredMovies.includes(movieId)) {
      setFeaturedMovies(featuredMovies.filter(id => id !== movieId));
    } else {
      setFeaturedMovies([...featuredMovies, movieId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homepageBanners: banners, featuredMovies })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Content published successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save CMS");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading CMS...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                <p className="text-sm text-gray-500">Manage what customers see on the homepage</p>
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publish Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Homepage Banners */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-blue-600" /> Hero Banners
            </h2>
            <p className="text-sm text-gray-500 mt-1">Image URLs displayed in the main carousel. Recommend 1920x600 ratio.</p>
          </div>
          <div className="p-6 space-y-4">
            {banners.map((url, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200 group">
                <img src={url} alt="Banner Preview" className="w-24 h-12 object-cover rounded-lg bg-gray-200" />
                <p className="text-sm text-gray-600 truncate flex-1">{url}</p>
                <button onClick={() => handleRemoveBanner(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Paste image URL (https://...)" 
                  value={newBanner}
                  onChange={(e) => setNewBanner(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] outline-none"
                />
              </div>
              <button onClick={handleAddBanner} className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Featured Movies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-600" /> Featured Movies
              </h2>
              <p className="text-sm text-gray-500 mt-1">Select movies to feature (they will scroll horizontally on the homepage).</p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 font-bold rounded-full text-sm">
              {featuredMovies.length} Selected
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {movies.map(movie => {
                const isSelected = featuredMovies.includes(movie._id);
                return (
                  <div 
                    key={movie._id}
                    onClick={() => handleToggleFeatured(movie._id)}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isSelected ? "border-[#f84464] bg-red-50/30" : "border-gray-100 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded shadow-sm bg-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? "text-[#f84464]" : "text-gray-900"}`}>{movie.title}</p>
                      <p className="text-xs text-gray-500">{(movie.genres || []).join(", ")}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
