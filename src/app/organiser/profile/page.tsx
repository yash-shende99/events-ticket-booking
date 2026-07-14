"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserCircle, Save, Mail, FileText, Globe, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";
import { useSession } from "next-auth/react";

export default function OrganiserProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    description: "We organize the best comedy shows and music events in the city.",
    website: "https://example.com",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Organiser Profile updated successfully!");
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UserCircle className="w-8 h-8 text-[#f84464]" /> Organiser Settings
            </h1>
            <p className="text-gray-500">Manage your public brand profile and contact information.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
          
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <UserCircle className="w-6 h-6 text-[#f84464]" />
              <h2 className="text-xl font-bold text-gray-900">Brand Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block font-bold text-gray-700 mb-2">Organiser / Brand Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464] transition"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">Contact Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    required
                    className="w-full pl-10 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464] transition"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-bold text-gray-700 mb-2">Public Description</label>
              <p className="text-sm text-gray-500 mb-2">This will appear on your event pages so attendees know who you are.</p>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea 
                  rows={4}
                  className="w-full pl-10 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464] transition"
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <Globe className="w-6 h-6 text-[#f84464]" />
              <h2 className="text-xl font-bold text-gray-900">Links & Website</h2>
            </div>
            
            <div className="max-w-2xl">
              <label className="block font-bold text-gray-700 mb-2">Website URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="url" 
                  className="w-full pl-10 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] focus:ring-1 focus:ring-[#f84464] transition"
                  value={profile.website}
                  placeholder="https://"
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#f84464] hover:bg-[#e03a58] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md disabled:opacity-70"
            >
              {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
