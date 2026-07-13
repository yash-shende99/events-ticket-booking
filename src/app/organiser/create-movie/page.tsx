"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { TrendingUp, UploadCloud, Film } from "lucide-react";
import { useSession } from "next-auth/react";
import UserMenuClient from "@/components/UserMenuClient";

export default function CreateMoviePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    rating: "0",
    votes: "0",
    formats: "2D",
    languages: "Hindi",
    duration: "2h 0m",
    genres: "Drama",
    certification: "UA",
    releaseDate: "2026-08-01",
    poster: "",
    about: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        formats: formData.formats.split(",").map(f => f.trim()),
        languages: formData.languages.split(",").map(f => f.trim()),
        genres: formData.genres.split(",").map(f => f.trim()),
        cast: [] // Mock empty cast for now to simplify
      };

      const res = await fetch("/api/organiser/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create movie");

      toast.success("Movie Listed Successfully!");
      router.push("/organiser");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
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

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b">
            <Film className="w-8 h-8 text-[#f84464]" />
            <h2 className="text-2xl font-bold text-gray-900">List a New Movie</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Inception" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                <input required type="date" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} placeholder="English, Hindi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genres (comma separated)</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} placeholder="Action, Sci-Fi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="2h 30m" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.certification} onChange={e => setFormData({...formData, certification: e.target.value})}>
                  <option value="U">U</option>
                  <option value="UA">UA</option>
                  <option value="A">A</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image URL</label>
              <div className="flex items-center gap-4">
                <input required type="url" className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.poster} onChange={e => setFormData({...formData, poster: e.target.value})} placeholder="https://example.com/poster.jpg" />
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-dashed border-gray-300">
                  {formData.poster ? <img src={formData.poster} alt="Preview" className="w-full h-full object-cover rounded-lg" /> : <UploadCloud className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About the Movie</label>
              <textarea required rows={4} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none resize-none" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="A thief who steals corporate secrets..."></textarea>
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-3 rounded-lg shadow-md transition disabled:opacity-70">
              {isLoading ? "Publishing Listing..." : "Publish Movie to Platform"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
