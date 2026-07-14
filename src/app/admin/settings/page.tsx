"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Loader2, Settings, Clock, Percent, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    seatHoldTTL: 10,
    waitlistExpiry: 30,
    bookingCancellationWindow: 4,
    platformFeePercentage: 10,
    taxRatePercentage: 18,
    qrExpiryHours: 24
  });

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }
    if (status === "authenticated") fetchConfig();
  }, [status, session, router]);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data && !data.error) {
        setConfig({
          seatHoldTTL: data.seatHoldTTL || 10,
          waitlistExpiry: data.waitlistExpiry || 30,
          bookingCancellationWindow: data.bookingCancellationWindow || 4,
          platformFeePercentage: data.platformFeePercentage || 10,
          taxRatePercentage: data.taxRatePercentage || 18,
          qrExpiryHours: data.qrExpiryHours || 24
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("System configuration saved securely!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading system parameters...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-gray-600" /> Global Configuration
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage core platform variables and financial rules.</p>
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Apply Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Time Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-blue-50/30">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Operational Timing
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Seat Hold TTL (Minutes)</label>
              <p className="text-xs text-gray-500 mb-2">How long a seat is locked during user checkout before being released.</p>
              <input 
                type="number" min="1" max="30" name="seatHoldTTL" 
                value={config.seatHoldTTL} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Waitlist Expiry (Minutes)</label>
              <p className="text-xs text-gray-500 mb-2">How long a user has to accept a waitlist offer before it passes to the next person.</p>
              <input 
                type="number" min="5" max="1440" name="waitlistExpiry" 
                value={config.waitlistExpiry} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-emerald-50/30">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" /> Financial & Tax
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Fee (%)</label>
              <p className="text-xs text-gray-500 mb-2">The percentage of each ticket sale taken as commission.</p>
              <input 
                type="number" min="0" max="100" name="platformFeePercentage" step="0.1"
                value={config.platformFeePercentage} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
              <p className="text-xs text-gray-500 mb-2">Government tax applied to the gross ticket price.</p>
              <input 
                type="number" min="0" max="100" name="taxRatePercentage" step="0.1"
                value={config.taxRatePercentage} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-purple-50/30">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" /> Security & Policy
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cancellation Window (Hours)</label>
              <p className="text-xs text-gray-500 mb-2">How many hours before showtime a customer can cancel their ticket.</p>
              <input 
                type="number" min="1" max="72" name="bookingCancellationWindow" 
                value={config.bookingCancellationWindow} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">QR Code Expiry (Hours)</label>
              <p className="text-xs text-gray-500 mb-2">How many hours after a showtime the entry QR code becomes invalid.</p>
              <input 
                type="number" min="1" max="168" name="qrExpiryHours" 
                value={config.qrExpiryHours} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
