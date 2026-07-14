"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Calendar, Image as ImageIcon, CheckCircle2, ChevronRight, X, Plus, IndianRupee, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import UserMenuClient from "@/components/UserMenuClient";

const EVENT_TYPES = ["Movie", "Event"];

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventType: "Movie",
    title: "",
    about: "",
    genres: "",
    languages: "",
    duration: "",
    certification: "U/A",
    releaseDate: "",
    status: "Pending Admin Approval", // Default to new request status
    poster: "",
    bannerUrl: "",
    trailerUrl: "",
    gallery: [] as string[],
    basePricing: [
      { category: "Standard", price: 250 },
      { category: "Premium", price: 450 }
    ],
    // Legacy fields needed by DB
    rating: "0",
    votes: "0",
    formats: ["2D"],
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

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

  const addPricingCategory = () => {
    setFormData({
      ...formData,
      basePricing: [...formData.basePricing, { category: "", price: 0 }]
    });
  };

  const updatePricing = (index: number, field: string, value: string | number) => {
    const newPricing = [...formData.basePricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setFormData({ ...formData, basePricing: newPricing });
  };

  const removePricingCategory = (index: number) => {
    const newPricing = [...formData.basePricing];
    newPricing.splice(index, 1);
    setFormData({ ...formData, basePricing: newPricing });
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
        genres: formData.genres.split(",").map(g => g.trim()).filter(Boolean),
        languages: formData.languages.split(",").map(l => l.trim()).filter(Boolean),
        cast: [], 
      };

      const res = await fetch("/api/organiser/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit event request");

      toast.success("Event Request Sent to Admin!");
      router.push("/organiser");
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
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= s ? 'bg-[#f84464] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
          </div>
          {i < 2 && <div className={`h-1 w-16 mx-2 rounded transition-colors ${step > s ? 'bg-[#f84464]' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
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

      <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#f84464] px-8 py-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Propose a New Listing</h2>
            <p className="text-rose-100 mt-2">Submit a movie or event request to the platform administrators.</p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.eventType} onChange={e => {
                        const newType = e.target.value;
                        setFormData({
                          ...formData, 
                          eventType: newType,
                          basePricing: newType === "Event" ? [
                            { category: "SILVER STANDING", price: 499 },
                            { category: "GOLD CHAIR", price: 898 },
                            { category: "EB PLATINUM CHAIR", price: 1247 },
                            { category: "EB VIP CHAIR", price: 1746 }
                          ] : [
                            { category: "Standard", price: 250 },
                            { category: "Premium", price: 450 }
                          ]
                        });
                      }}>
                        {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Coldplay Tour 2026" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea required rows={4} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none resize-none" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Describe the listing..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genres / Categories (comma separated) *</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} placeholder={formData.eventType === "Movie" ? "Action, Sci-Fi" : "Music, Live Concert"} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated) *</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} placeholder="English, Hindi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2h 30m" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Release / Start Date *</label>
                      <input required type="date" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                    </div>

                    {/* DYNAMIC FIELD: Certification only for Movies */}
                    {formData.eventType === "Movie" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Certification</label>
                        <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.certification} onChange={e => setFormData({...formData, certification: e.target.value})}>
                          <option value="U">U (Universal)</option>
                          <option value="U/A">U/A (Parental Guidance)</option>
                          <option value="A">A (Adults Only)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: RICH MEDIA */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#f84464]" /> Rich Media</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Poster URL (Vertical) *</label>
                      <input required type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.poster} onChange={e => setFormData({...formData, poster: e.target.value})} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL (Horizontal)</label>
                      <input type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} placeholder="https://..." />
                    </div>
                    {formData.eventType === "Movie" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trailer URL (YouTube)</label>
                        <input type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                      </div>
                    )}
                    
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

              {/* STEP 3: BASE PRICING & SUBMIT */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-[#f84464]" /> Base Pricing Configuration</h3>
                  
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100 mb-6">
                    <p className="font-bold mb-1">How Pricing Works</p>
                    <p>Define the base pricing tiers for this listing. If this is a movie, define standard classes (e.g. Silver, Gold, Platinum). If this is an event, define sections (e.g. VIP, General Admission).</p>
                  </div>

                  <div className="space-y-4">
                    {formData.basePricing.map((pricing, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category Name</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                            value={pricing.category} 
                            onChange={(e) => updatePricing(index, "category", e.target.value)} 
                            placeholder={formData.eventType === "Movie" ? "e.g. Gold" : "e.g. VIP Front Row"} 
                          />
                        </div>
                        <div className="w-1/3">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price (₹)</label>
                          <input 
                            required 
                            type="number" 
                            min="0"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none font-mono" 
                            value={pricing.price} 
                            onChange={(e) => updatePricing(index, "price", Number(e.target.value))} 
                          />
                        </div>
                        {formData.basePricing.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removePricingCategory(index)} 
                            className="mt-5 p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button 
                      type="button" 
                      onClick={addPricingCategory} 
                      className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-[#f84464] text-gray-600 hover:text-[#f84464] rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Plus className="w-5 h-5" /> Add Pricing Category
                    </button>
                  </div>

                  <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-100 mt-8">
                    <p className="font-bold mb-1">Admin Approval Required</p>
                    <p>Once you submit this listing and pricing setup, it will be sent to the Platform Admin for review. You can schedule showtimes only after it is <strong>Approved</strong>.</p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t flex justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition">Back</button>
                ) : <div></div>}
                
                <button disabled={isLoading} type="submit" className="flex items-center gap-2 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-3 px-8 rounded-lg shadow-md transition disabled:opacity-70">
                  {isLoading ? "Saving..." : step === 3 ? "Submit Request to Admin" : "Next Step"}
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
