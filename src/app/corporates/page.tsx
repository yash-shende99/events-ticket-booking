"use client";

import { useState } from "react";
import { Building2, Users, MapPin, Ticket, Film, Sparkles, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CorporatesPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/corporates/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Thank you for reaching out! Our Corporate team will contact you shortly.");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-[#2b3149] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">CineVerse for Corporates</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Partner with us to offer the ultimate entertainment experience to your employees, clients, and partners. 
            Bulk bookings, exclusive screenings, and corporate vouchers tailored for your business.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Bulk Ticket Booking</h3>
                  <p className="text-gray-600 mt-1">Get exclusive corporate discounts on bulk ticket purchases for the latest blockbusters across all our partner cinemas.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <Film className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Private Screenings</h3>
                  <p className="text-gray-600 mt-1">Book an entire auditorium for your corporate events, town halls, or private movie premieres with customized catering.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Corporate Gifting & Vouchers</h3>
                  <p className="text-gray-600 mt-1">Reward your employees or clients with CineVerse gift cards and e-vouchers, valid for movies, food, and beverages.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Theatre Franchising</h3>
                  <p className="text-gray-600 mt-1">Looking to list your theatre or partner with our brand? We offer seamless onboarding and revenue management solutions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-none shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-gray-500 mb-6">Fill out the form below and our Corporate Alliance team will get back to you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input name="firstName" required type="text" className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input name="lastName" required type="text" className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input name="companyName" required type="text" className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none" placeholder="Acme Corp" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Email Address *</label>
                <input name="email" required type="email" className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input name="mobile" required type="tel" className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none" placeholder="+91 XXXXX XXXXX" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Enquiry *</label>
                <select name="enquiryType" required className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none bg-white">
                  <option value="">Select an option</option>
                  <option value="bulk_booking">Bulk Ticket Booking</option>
                  <option value="private_screening">Private Screening</option>
                  <option value="corporate_gifting">Corporate Gifting</option>
                  <option value="theatre_partnership">Theatre Partnership / Listing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea name="message" rows={4} className="w-full border border-gray-300 rounded-none px-4 py-2.5 focus:ring-2 focus:ring-[#f84464] focus:border-[#f84464] outline-none resize-none" placeholder="Tell us more about your requirements..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#f84464] hover:bg-[#e03c5a] text-white font-bold py-3 px-4 rounded-none transition flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Enquiry</>}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
