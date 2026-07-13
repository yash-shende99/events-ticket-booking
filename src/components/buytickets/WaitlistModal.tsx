"use client";

import { useState } from "react";
import { X, User, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtimeId: string;
}

export default function WaitlistModal({ isOpen, onClose, showtimeId }: WaitlistModalProps) {
  const [seatCount, setSeatCount] = useState(2);
  const [category, setCategory] = useState("Any");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email to join the waitlist.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Joining waitlist...");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId,
          email,
          phone,
          seatsNeeded: seatCount,
          category,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("You are on the waitlist! We will notify you if tickets become available.", { id: loadingToast });
        onClose();
      } else {
        toast.error(data.error || "Failed to join waitlist", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Join Waitlist</h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This show is currently <span className="font-semibold text-gray-700">sold out</span>. Join the waitlist and we'll instantly notify you if seats matching your preferences are cancelled!
          </p>

          {/* Seat Count */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">How many tickets?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSeatCount(num)}
                  className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
                    seatCount === num 
                      ? 'bg-[#f84464] text-white shadow-sm' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Preferred Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-[#f84464] focus:border-[#f84464] block p-2.5 outline-none transition"
            >
              <option value="Any">Any Category</option>
              <option value="Recliner">₹800 Recliner</option>
              <option value="Classic Plus">₹450 Classic Plus</option>
              <option value="Classic">₹360 Classic</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 mb-8">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Contact Details</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#f84464] focus:border-[#f84464] block w-full pl-10 p-2.5 outline-none transition" 
                placeholder="Email Address" 
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#f84464] focus:border-[#f84464] block w-full pl-10 p-2.5 outline-none transition" 
                placeholder="Phone Number (Optional)" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f84464] hover:bg-[#e03c5a] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
        </form>
      </div>
    </div>
  );
}
