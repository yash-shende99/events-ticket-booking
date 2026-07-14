"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, ShieldCheck, Clock, CreditCard, Save } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    bookingCutoff: "30", // minutes
    cancellationPolicy: "flexible", // flexible, moderate, strict
    refundPercentage: "90", // percent
    autoApproveRefunds: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 800);
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
        <div className="flex items-center gap-4">
          <Link href="/organiser" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Dashboard
          </Link>
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
          <span>ℹ️</span> This section is for Theatre & Place Owners (Venue Management), not Event Organizers.
        </div>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-8 h-8 text-[#f84464]" /> Venue Settings
            </h1>
            <p className="text-gray-500">Configure global booking rules, policies, and ticketing limits.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
          {/* Booking Window */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Clock className="w-6 h-6 text-[#f84464]" />
              <h2 className="text-xl font-bold text-gray-900">Booking Window</h2>
            </div>
            
            <div className="max-w-lg">
              <label className="block font-bold text-gray-700 mb-2">Stop bookings before showtime</label>
              <p className="text-sm text-gray-500 mb-4">Tickets will not be sold within this time frame before the event starts.</p>
              
              <div className="flex items-center gap-4">
                <select 
                  className="w-full sm:w-1/2 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]"
                  value={settings.bookingCutoff}
                  onChange={(e) => setSettings({...settings, bookingCutoff: e.target.value})}
                >
                  <option value="0">Right until showtime</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cancellation & Refunds */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <CreditCard className="w-6 h-6 text-[#f84464]" />
              <h2 className="text-xl font-bold text-gray-900">Cancellations & Refunds</h2>
            </div>
            
            <div className="space-y-8 max-w-2xl">
              <div>
                <label className="block font-bold text-gray-700 mb-2">Cancellation Policy Strictness</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div 
                    onClick={() => setSettings({...settings, cancellationPolicy: 'flexible'})}
                    className={`border rounded-xl p-4 cursor-pointer transition ${settings.cancellationPolicy === 'flexible' ? 'border-[#f84464] bg-rose-50 ring-1 ring-[#f84464]' : 'hover:border-gray-300'}`}
                  >
                    <h3 className="font-bold text-gray-900 mb-1">Flexible</h3>
                    <p className="text-xs text-gray-500">Cancel up to 2 hours before the show.</p>
                  </div>
                  <div 
                    onClick={() => setSettings({...settings, cancellationPolicy: 'moderate'})}
                    className={`border rounded-xl p-4 cursor-pointer transition ${settings.cancellationPolicy === 'moderate' ? 'border-[#f84464] bg-rose-50 ring-1 ring-[#f84464]' : 'hover:border-gray-300'}`}
                  >
                    <h3 className="font-bold text-gray-900 mb-1">Moderate</h3>
                    <p className="text-xs text-gray-500">Cancel up to 12 hours before the show.</p>
                  </div>
                  <div 
                    onClick={() => setSettings({...settings, cancellationPolicy: 'strict'})}
                    className={`border rounded-xl p-4 cursor-pointer transition ${settings.cancellationPolicy === 'strict' ? 'border-[#f84464] bg-rose-50 ring-1 ring-[#f84464]' : 'hover:border-gray-300'}`}
                  >
                    <h3 className="font-bold text-gray-900 mb-1">Strict</h3>
                    <p className="text-xs text-gray-500">No cancellations allowed within 24 hours.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">Base Refund Percentage</label>
                <p className="text-sm text-gray-500 mb-4">How much of the ticket price is refunded (excluding convenience fees).</p>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="50" max="100" step="10" 
                    className="w-full sm:w-1/2 accent-[#f84464]"
                    value={settings.refundPercentage}
                    onChange={(e) => setSettings({...settings, refundPercentage: e.target.value})}
                  />
                  <span className="font-bold text-xl">{settings.refundPercentage}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border">
                <input 
                  type="checkbox" 
                  id="autoRefund" 
                  className="w-5 h-5 accent-[#f84464] cursor-pointer"
                  checked={settings.autoApproveRefunds}
                  onChange={(e) => setSettings({...settings, autoApproveRefunds: e.target.checked})}
                />
                <label htmlFor="autoRefund" className="font-medium text-gray-700 cursor-pointer">
                  Automatically process eligible refunds (Recommended)
                </label>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <ShieldCheck className="w-6 h-6 text-[#f84464]" />
              <h2 className="text-xl font-bold text-gray-900">QR Security Settings</h2>
            </div>
            
            <p className="text-gray-500">QR codes are dynamically generated and cryptographically signed upon booking. To prevent fraud, QR screenshots are blocked in the mobile app.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#f84464] hover:bg-[#e03a58] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md disabled:opacity-70"
            >
              {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save All Settings</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
