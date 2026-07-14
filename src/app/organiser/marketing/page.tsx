"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Megaphone, Tag, Mail, BellRing, Plus, Send, Copy } from "lucide-react";
import toast from "react-hot-toast";

// Mock Data for MVP
const INITIAL_PROMOS = [
  { id: 1, code: "SUMMER50", discount: "50%", type: "Percentage", validity: "2026-08-30", status: "Active" },
  { id: 2, code: "EARLYBIRD", discount: "₹200", type: "Flat", validity: "2026-07-20", status: "Active" },
  { id: 3, code: "WEEKEND", discount: "20%", type: "Percentage", validity: "2026-07-10", status: "Expired" },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("promos");
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const [newPromo, setNewPromo] = useState({ code: "", discount: "", type: "Percentage", validity: "" });

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromos([{ id: Date.now(), ...newPromo, discount: newPromo.type === "Flat" ? `₹${newPromo.discount}` : `${newPromo.discount}%`, status: "Active" }, ...promos]);
    setShowPromoModal(false);
    setNewPromo({ code: "", discount: "", type: "Percentage", validity: "" });
    toast.success("Promo Code Created!");
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Campaign dispatched successfully! Emails are queueing.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/organiser">
            <span className="text-3xl font-bold tracking-tighter text-gray-900">
              Cine<span className="text-[#f84464]">Verse</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <h1 className="text-lg font-bold text-gray-700 tracking-tight">Organiser Hub</h1>
        </div>
        <Link href="/organiser" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="w-8 h-8 text-[#f84464]" /> Marketing & Promotions
            </h1>
            <p className="text-gray-500">Engage customers, create discount codes, and launch campaigns.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("promos")}
            className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "promos" ? "border-[#f84464] text-[#f84464]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Promo Codes
          </button>
          <button 
            onClick={() => setActiveTab("email")}
            className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "email" ? "border-[#f84464] text-[#f84464]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Email Campaigns
          </button>
          <button 
            onClick={() => setActiveTab("push")}
            className={`px-6 py-3 font-bold border-b-2 transition ${activeTab === "push" ? "border-[#f84464] text-[#f84464]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Push Notifications
          </button>
        </div>

        {/* PROMOS TAB */}
        {activeTab === "promos" && (
          <div className="animate-fadeIn">
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setShowPromoModal(true)}
                className="bg-[#f84464] hover:bg-[#e03a58] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" /> Create Promo Code
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promos.map(promo => (
                <div key={promo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-full h-1 ${promo.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-rose-50 text-[#f84464] font-mono font-bold px-3 py-1 rounded-md tracking-wider flex items-center gap-2">
                      {promo.code} <Copy className="w-3 h-3 cursor-pointer" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {promo.status}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-1">{promo.discount} OFF</h3>
                  <p className="text-sm text-gray-500 mb-4">{promo.type} Discount</p>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Valid until:</span>
                    <span className="font-bold text-gray-900">{new Date(promo.validity).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMAIL CAMPAIGNS TAB */}
        {activeTab === "email" && (
          <div className="animate-fadeIn max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Compose Email Blast</h2>
                  <p className="text-gray-500">Reach out to your past customers to promote upcoming events.</p>
                </div>
              </div>
              
              <form onSubmit={handleSendCampaign} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]">
                    <option>All Past Attendees (Estimated: 2,450)</option>
                    <option>VIP Customers Only</option>
                    <option>Waitlisted Users</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                  <input required type="text" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" placeholder="e.g. Exclusive 50% Off Tickets This Weekend!" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                  <textarea required rows={6} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] resize-none" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#f84464] hover:bg-[#e03a58] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition">
                  <Send className="w-5 h-5" /> Dispatch Campaign
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PUSH TAB */}
        {activeTab === "push" && (
          <div className="animate-fadeIn max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellRing className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mobile Push Notifications</h2>
              <p className="text-gray-500 mb-6">Push notifications require the CineVerse Mobile App integration. Contact platform admin to unlock this feature for your account.</p>
              <button disabled className="bg-gray-200 text-gray-400 px-6 py-2.5 rounded-lg font-bold cursor-not-allowed">
                Feature Locked
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE PROMO MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Create Promo Code</h2>
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Name</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] uppercase font-mono" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER50" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value})}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input required type="number" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} placeholder="e.g. 50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input required type="date" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newPromo.validity} onChange={e => setNewPromo({...newPromo, validity: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPromoModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition">Cancel</button>
                <button type="submit" className="flex-1 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-2 rounded-lg transition">Create Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
