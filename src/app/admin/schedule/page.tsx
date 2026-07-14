"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Calendar as CalendarIcon, Clock, MapPin, IndianRupee, CheckCircle2, ChevronRight, X, Plus, Shield } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminScheduleEnginePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [events, setEvents] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [venueRequests, setVenueRequests] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    eventId: "",
    isEvent: false,
    eventLocation: "",
    theaterId: "",
    screen: "Hall 1",
    capacity: 100,
    date: "",
    pricing: { premium: 800, standard: 450, economy: 250, platinum: 1000, gold: 600, silver: 350, recliner: 1200 },
    dynamicPricing: {
      isWeekendPricing: false,
      isFestivalPricing: false,
      isEarlyBirdActive: false,
    }
  });

  const [timings, setTimings] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      const searchParams = new URLSearchParams(window.location.search);
      const preMovieId = searchParams.get("movieId");
      const preVenueId = searchParams.get("venueId");
      const preScreenId = searchParams.get("screenId");
      const preIsEvent = searchParams.get("isEvent") === "true";
      const preLocation = searchParams.get("location") || "";

      Promise.all([
        fetch("/api/admin/events").then(res => res.json()),
        fetch("/api/theaters").then(res => res.json()),
        fetch("/api/admin/venue-requests").then(res => res.json())
      ]).then(([eventsData, theatersData, venueReqsData]) => {
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setTheaters(Array.isArray(theatersData) ? theatersData : []);
        const validVenueReqs = Array.isArray(venueReqsData) ? venueReqsData : [];
        setVenueRequests(validVenueReqs);
        
        let initialEventId = eventsData.length > 0 ? eventsData[0]._id : "";
        if (preMovieId && eventsData.some((e: any) => e._id === preMovieId)) {
          initialEventId = preMovieId;
        }

        let initialTheaterId = theatersData.length > 0 ? theatersData[0]._id : "";
        if (preVenueId && theatersData.some((t: any) => t._id === preVenueId)) {
          initialTheaterId = preVenueId;
        }

        let initialScreenName = "";
        let initialCapacity = 100;

        if (initialTheaterId) {
           const t = theatersData.find((t: any) => t._id === initialTheaterId);
           if (t?.screens && t.screens.length > 0) {
              if (preScreenId && preScreenId !== "Any") {
                 const scr = t.screens.find((s: any) => s._id === preScreenId);
                 if (scr) {
                    initialScreenName = scr.name;
                    initialCapacity = scr.capacity || 100;
                 } else {
                    initialScreenName = t.screens[0].name;
                    initialCapacity = t.screens[0].capacity || 100;
                 }
              } else {
                 initialScreenName = t.screens[0].name;
                 initialCapacity = t.screens[0].capacity || 100;
              }
           }
        }

        let initialIsEvent = preIsEvent;
        let finalLocation = preLocation;

        if (initialEventId) {
          const ev = eventsData.find((e: any) => e._id === initialEventId);
          if (ev && ev.eventType === "Event") {
            initialIsEvent = true;
            if (!finalLocation) {
               // Try to find the venue request for this event
               const vReq = validVenueReqs.find((req: any) => (req.movieId?._id || req.movieId) === initialEventId);
               if (vReq && vReq.eventLocation) {
                 finalLocation = vReq.eventLocation;
               }
            }
          }
        }

        setFormData(prev => ({ 
          ...prev, 
          eventId: initialEventId,
          isEvent: initialIsEvent,
          eventLocation: finalLocation,
          theaterId: initialTheaterId,
          screen: initialScreenName,
          capacity: initialCapacity
        }));
      }).finally(() => {
        setFetchingData(false);
      });
    }
  }, [status, session, router]);

  const handleAddTime = () => {
    if (newTime.trim() && !timings.includes(newTime.trim())) {
      setTimings([...timings, newTime.trim()]);
      setNewTime("");
    }
  };

  const removeTime = (index: number) => {
    const newT = [...timings];
    newT.splice(index, 1);
    setTimings(newT);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (timings.length === 0) {
      toast.error("Please add at least one show timing.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        timings,
      };

      const res = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deploy schedule");

      toast.success(`Successfully deployed ${data.count} showtimes!`);
      router.push("/admin");
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

  if (fetchingData || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading Engine Data...</div>;
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
            Exit Engine
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Global Schedule Engine</h2>
            <p className="text-gray-300 mt-2">Map Organizer events to your venues, assign screens, and deploy pricing.</p>
          </div>

          <div className="p-8">
            {renderStepIndicators()}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: EVENT & VENUE */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#f84464]" /> Venue Mapping</h3>
                  
                  {events.length === 0 ? (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">No pending events to schedule.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Event (Status)</label>
                        <select required className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f84464] outline-none bg-gray-50" value={formData.eventId} onChange={e => {
                          const evId = e.target.value;
                          const ev = events.find(ev => ev._id === evId);
                          const isEvent = ev?.eventType === 'Event';
                          let loc = formData.eventLocation;
                          if (isEvent) {
                            const vReq = venueRequests.find((req: any) => (req.movieId?._id || req.movieId) === evId);
                            if (vReq && vReq.eventLocation) loc = vReq.eventLocation;
                          }
                          setFormData({...formData, eventId: evId, isEvent: isEvent, eventLocation: loc});
                        }}>
                          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title} ({ev.eventType || 'Movie'}) - {ev.status}</option>)}
                        </select>
                      </div>

                      {formData.isEvent ? (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Location</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                            value={formData.eventLocation} 
                            onChange={e => setFormData({...formData, eventLocation: e.target.value})} 
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Theater Venue</label>
                            <select required className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.theaterId} onChange={e => setFormData({...formData, theaterId: e.target.value})}>
                              {theaters.map(t => <option key={t._id} value={t._id}>{t.name} - {t.city}</option>)}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Screen / Hall</label>
                            {theaters.find(t => t._id === formData.theaterId)?.screens?.length > 0 ? (
                              <select 
                                required 
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" 
                                value={formData.screen} 
                                onChange={e => {
                                  const screenName = e.target.value;
                                  const t = theaters.find(t => t._id === formData.theaterId);
                                  const s = t?.screens?.find((scr: any) => scr.name === screenName);
                                  setFormData({...formData, screen: screenName, capacity: s?.capacity || 100});
                                }}
                              >
                                <option value="">Select a screen...</option>
                                {theaters.find(t => t._id === formData.theaterId)?.screens?.map((s: any) => (
                                  <option key={s._id} value={s.name}>{s.name} ({s.capacity} seats)</option>
                                ))}
                              </select>
                            ) : (
                              <div className="w-full border border-red-200 bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm font-medium">
                                No screens configured for this theater.
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          Max Seat Capacity (Hard Cap) 
                          {!formData.isEvent && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Auto-filled from screen layout</span>}
                        </label>
                        <input required type="number" min="1" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none bg-gray-50" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: TIMINGS */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><Clock className="w-5 h-5 text-[#f84464]" /> Schedule Timings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                    <input required type="date" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f84464] outline-none bg-gray-50" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <label className="block text-sm font-bold text-gray-900 mb-4">Bulk Inject Show Timings</label>
                    <div className="flex gap-2 mb-6">
                      <input type="text" className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f84464] outline-none" value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="e.g. 10:00 AM, 02:30 PM" />
                      <button type="button" onClick={handleAddTime} className="bg-gray-800 hover:bg-gray-900 text-white px-6 rounded-lg font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Add Slot</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {timings.length === 0 && <span className="text-gray-400 text-sm">No timings added yet. Add at least one to proceed.</span>}
                      {timings.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-[#f84464] text-[#f84464] px-4 py-2 rounded-full font-bold shadow-sm">
                          <Clock className="w-4 h-4" />
                          {t}
                          <button type="button" onClick={() => removeTime(i)} className="ml-2 text-gray-400 hover:text-[#f84464]"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING */}
              {step === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-[#f84464]" /> Pricing Engine</h3>
                  
                  {formData.isEvent ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gray-200 p-4 rounded-xl border border-gray-400">
                        <label className="block text-sm font-bold text-gray-800 mb-2">SILVER STANDING (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 outline-none bg-white text-gray-900" value={formData.pricing.silver} onChange={e => setFormData({...formData, pricing: {...formData.pricing, silver: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-300">
                        <label className="block text-sm font-bold text-yellow-900 mb-2">GOLD CHAIR (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900" value={formData.pricing.gold} onChange={e => setFormData({...formData, pricing: {...formData.pricing, gold: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-900">
                        <label className="block text-sm font-bold text-white mb-2">EB PLATINUM CHAIR (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 outline-none bg-white text-gray-900" value={formData.pricing.platinum} onChange={e => setFormData({...formData, pricing: {...formData.pricing, platinum: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <label className="block text-sm font-bold text-amber-900 mb-2">EB VIP CHAIR (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900" value={formData.pricing.premium} onChange={e => setFormData({...formData, pricing: {...formData.pricing, premium: Number(e.target.value)}})} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <label className="block text-sm font-bold text-amber-900 mb-2">Premium (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-gray-900" value={formData.pricing.premium} onChange={e => setFormData({...formData, pricing: {...formData.pricing, premium: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-sm font-bold text-slate-900 mb-2">Standard (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-500 outline-none bg-white text-gray-900" value={formData.pricing.standard} onChange={e => setFormData({...formData, pricing: {...formData.pricing, standard: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <label className="block text-sm font-bold text-emerald-900 mb-2">Economy (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-gray-900" value={formData.pricing.economy} onChange={e => setFormData({...formData, pricing: {...formData.pricing, economy: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-900">
                        <label className="block text-sm font-bold text-white mb-2">Platinum (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 outline-none bg-white text-gray-900" value={formData.pricing.platinum} onChange={e => setFormData({...formData, pricing: {...formData.pricing, platinum: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-300">
                        <label className="block text-sm font-bold text-yellow-900 mb-2">Gold (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-gray-900" value={formData.pricing.gold} onChange={e => setFormData({...formData, pricing: {...formData.pricing, gold: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-gray-200 p-4 rounded-xl border border-gray-400">
                        <label className="block text-sm font-bold text-gray-800 mb-2">Silver (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 outline-none bg-white text-gray-900" value={formData.pricing.silver} onChange={e => setFormData({...formData, pricing: {...formData.pricing, silver: Number(e.target.value)}})} />
                      </div>
                      <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                        <label className="block text-sm font-bold text-rose-900 mb-2">Recliner (₹)</label>
                        <input required type="number" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none bg-white text-gray-900" value={formData.pricing.recliner} onChange={e => setFormData({...formData, pricing: {...formData.pricing, recliner: Number(e.target.value)}})} />
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-900 mb-4">Dynamic Pricing Algorithms</h4>
                    
                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <div>
                        <span className="font-bold block text-gray-800">Weekend Surge Pricing</span>
                        <span className="text-sm text-gray-500">Automatically scale up prices by 15% on Friday-Sunday</span>
                      </div>
                      <input type="checkbox" className="w-5 h-5 accent-[#f84464]" checked={formData.dynamicPricing.isWeekendPricing} onChange={e => setFormData({...formData, dynamicPricing: {...formData.dynamicPricing, isWeekendPricing: e.target.checked}})} />
                    </label>

                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <div>
                        <span className="font-bold block text-gray-800">Festival Pricing</span>
                        <span className="text-sm text-gray-500">Enable peak-season rates for high-demand holidays</span>
                      </div>
                      <input type="checkbox" className="w-5 h-5 accent-[#f84464]" checked={formData.dynamicPricing.isFestivalPricing} onChange={e => setFormData({...formData, dynamicPricing: {...formData.dynamicPricing, isFestivalPricing: e.target.checked}})} />
                    </label>

                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <div>
                        <span className="font-bold block text-gray-800">Early Bird Discount</span>
                        <span className="text-sm text-gray-500">Offer 20% off for the first 50 tickets sold automatically</span>
                      </div>
                      <input type="checkbox" className="w-5 h-5 accent-[#f84464]" checked={formData.dynamicPricing.isEarlyBirdActive} onChange={e => setFormData({...formData, dynamicPricing: {...formData.dynamicPricing, isEarlyBirdActive: e.target.checked}})} />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-8 flex justify-between items-center">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2">← Back</button>
                ) : <div></div>}
                
                <button disabled={isLoading || events.length === 0} type="submit" className="flex items-center gap-2 bg-[#f84464] hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition disabled:opacity-70">
                  {isLoading ? "Deploying..." : step === 3 ? "Deploy Schedule & Publish" : "Continue"}
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
