"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Calendar, Image as ImageIcon, CheckCircle2, ChevronRight, X, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import UserMenuClient from "@/components/UserMenuClient";

const EVENT_TYPES = ["Movie", "Event"];

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    eventType: "Movie",
    title: "",
    about: "",
    genres: "",
    languages: "",
    duration: "",
    certification: "U/A",
    releaseDate: "",
    status: "Pending Schedule",
    poster: "",
    bannerUrl: "",
    trailerUrl: "",
    gallery: [] as string[],
    rating: "0",
    votes: "0",
    formats: ["2D"],
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated" && params.id) {
      fetchEventData();
    }
  }, [status, session, router, params.id]);

  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/organiser/movies/${params.id}`);
      if (!res.ok) throw new Error("Failed to load event data");
      
      const data = await res.json();
      
      setFormData({
        ...data,
        genres: Array.isArray(data.genres) ? data.genres.join(", ") : data.genres || "",
        languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "",
        releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : "",
        gallery: data.gallery || [],
      });
    } catch (error: any) {
      toast.error(error.message);
      router.push("/organiser/events");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setFormData({ ...formData, gallery: [...formData.gallery, newGalleryUrl.trim()] });
      setNewGalleryUrl("");
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        genres: typeof formData.genres === 'string' ? formData.genres.split(",").map(g => g.trim()).filter(Boolean) : formData.genres,
        languages: typeof formData.languages === 'string' ? formData.languages.split(",").map(l => l.trim()).filter(Boolean) : formData.languages,
      };

      const res = await fetch(`/api/organiser/movies/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update event");

      toast.success("Event updated successfully!");
      router.push("/organiser/events");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicators = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s ? 'bg-[#f84464] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
          </div>
          {i < 2 && <div className={`h-1 w-16 mx-2 rounded ${step > s ? 'bg-[#f84464]' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  if (isFetching) return <div className="min-h-screen flex items-center justify-center">Loading Event Details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
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
          <Link href="/organiser/events" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Events
          </Link>
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#f84464] px-8 py-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Edit Event: {formData.title || "Event"}</h2>
            <p className="text-rose-100 mt-2">Update the details of your listing.</p>
          </div>

          <div className="p-8">
            {renderStepIndicators()}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#f84464]" /> Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.eventType || "Movie"} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                        {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Coldplay Tour 2026" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea required rows={4} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none resize-none" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Describe the event..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genres (comma separated)</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} placeholder="Music, Live" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} placeholder="English" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2h 30m" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Restriction</label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.certification || "U/A"} onChange={e => setFormData({...formData, certification: e.target.value})}>
                        <option value="U">U (Universal)</option>
                        <option value="U/A">U/A (Parental Guidance)</option>
                        <option value="A">A (Adults Only)</option>
                        <option value="All Ages">All Ages</option>
                        <option value="18+">18+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: RICH MEDIA */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#f84464]" /> Rich Media</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Poster URL (Vertical)</label>
                      <input required type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.poster} onChange={e => setFormData({...formData, poster: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL (Horizontal)</label>
                      <input type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trailer URL (YouTube)</label>
                      <input type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                      <div className="flex gap-2 mb-4">
                        <input type="url" className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} placeholder="Add gallery image URL..." />
                        <button type="button" onClick={handleAddGalleryImage} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 rounded-lg font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add</button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.gallery.map((img, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border bg-white aspect-video">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE & STATUS */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#f84464]" /> Schedule & Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Event Date</label>
                      <input required type="date" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publishing Status</label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.status || "Pending Schedule"} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Pending Schedule">Pending Schedule</option>
                        <option value="pending">pending (Admin Review)</option>
                        <option value="approved">approved</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t flex justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition">Back</button>
                ) : <div></div>}
                
                <button disabled={isLoading} type="submit" className="flex items-center gap-2 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-3 px-8 rounded-lg shadow-md transition disabled:opacity-70">
                  {isLoading ? "Saving..." : step === 3 ? "Save Changes" : "Next Step"}
                  {step < 3 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
