"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, Globe, MailPlus, Clock, Megaphone, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"GLOBAL" | "PROMO" | "WAITLIST">("GLOBAL");
  const [audience, setAudience] = useState<"ALL" | "CUSTOMERS" | "ORGANISERS">("ALL");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchHistory();
    }
  }, [status, session, router]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, audience, subject, message })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message, { icon: "🚀" });
      setSubject("");
      setMessage("");
      fetchHistory();
    } catch (error: any) {
      toast.error(error.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
          </div>
          <p className="text-gray-500 ml-11">Dispatch global broadcasts, marketing emails, and emergency alerts.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => { setActiveTab("GLOBAL"); setSubject(""); setMessage(""); }}
              className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "GLOBAL" ? "text-[#f84464] border-b-2 border-[#f84464] bg-red-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Globe className="w-4 h-4" /> Global Broadcast
            </button>
            <button 
              onClick={() => { setActiveTab("PROMO"); setSubject(""); setMessage(""); }}
              className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "PROMO" ? "text-[#f84464] border-b-2 border-[#f84464] bg-red-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Megaphone className="w-4 h-4" /> Promo Email
            </button>
            <button 
              onClick={() => { setActiveTab("WAITLIST"); setSubject(""); setMessage(""); }}
              className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "WAITLIST" ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50/30" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Clock className="w-4 h-4" /> Waitlist Offers
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              activeTab === "GLOBAL" ? "bg-red-50 text-red-800" :
              activeTab === "PROMO" ? "bg-red-50 text-red-800" :
              "bg-amber-50 text-amber-800"
            }`}>
              {activeTab === "GLOBAL" && <Globe className="w-5 h-5 mt-0.5 shrink-0 text-[#f84464]" />}
              {activeTab === "PROMO" && <Megaphone className="w-5 h-5 mt-0.5 shrink-0 text-[#f84464]" />}
              {activeTab === "WAITLIST" && <Clock className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />}
              <div>
                <h4 className="font-semibold text-sm">
                  {activeTab === "GLOBAL" && "System-wide Alert"}
                  {activeTab === "PROMO" && "Marketing Campaign"}
                  {activeTab === "WAITLIST" && "Targeted Offer"}
                </h4>
                <p className="text-sm mt-1 opacity-90">
                  {activeTab === "GLOBAL" && "This message will be broadcast to ALL active users on the platform immediately. Use for emergency alerts or critical platform updates."}
                  {activeTab === "PROMO" && "This email will be dispatched to all customers who have opted-in to marketing communications."}
                  {activeTab === "WAITLIST" && "Send an instant offer to the top 15 users waiting for sold-out events. The offer expires in 30 minutes."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
              {activeTab !== "WAITLIST" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    disabled={loading}
                  >
                    <option value="ALL">All Active Users (Customers & Organisers)</option>
                    <option value="CUSTOMERS">Customers Only</option>
                    <option value="ORGANISERS">Organisers Only</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  placeholder={
                    activeTab === "GLOBAL" ? "e.g., Scheduled Maintenance Downtime" :
                    activeTab === "PROMO" ? "e.g., 20% OFF Weekend Blockbusters!" :
                    "e.g., Seats unlocked for Avengers!"
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  rows={6}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
                  } ${
                    activeTab === "GLOBAL" ? "bg-[#f84464] hover:bg-[#e03a58] hover:shadow-[#f84464]/25" :
                    activeTab === "PROMO" ? "bg-[#f84464] hover:bg-[#e03a58] hover:shadow-[#f84464]/25" :
                    "bg-amber-600 hover:bg-amber-700 hover:shadow-amber-600/25"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Dispatching...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Dispatch Message</>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Recent Dispatches</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-gray-500">
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Audience</th>
                    <th className="px-6 py-4 font-semibold">Subject</th>
                    <th className="px-6 py-4 font-semibold text-right">Recipients</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                          h.type === "GLOBAL" ? "bg-blue-100 text-blue-700" :
                          h.type === "PROMO" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {h.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{h.audience}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{h.subject}</td>
                      <td className="px-6 py-4 text-right text-gray-500 font-medium">{h.recipientCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
