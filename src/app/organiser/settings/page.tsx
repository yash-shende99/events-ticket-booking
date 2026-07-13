"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";
import { UploadCloud, Save } from "lucide-react";

export default function OrganiserSettingsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactPhone: "",
    bannerUrl: "",
    profilePicture: "",
  });

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/organiser/profile");
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.user.name || "",
            companyName: data.user.companyName || "",
            contactPhone: data.user.contactPhone || "",
            bannerUrl: data.user.bannerUrl || "",
            profilePicture: data.user.profilePicture || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/organiser/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      toast.success("Profile Updated Successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#f84464] px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Organiser Profile Settings</h2>
            <p className="text-rose-100 mt-1">Manage your public brand identity and contact details.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Studio Name</label>
                  <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager / Representative Name</label>
                  <input required type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input type="tel" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Branding</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo URL</label>
                  <div className="flex gap-4 items-center">
                    <input type="url" className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.profilePicture} onChange={e => setFormData({...formData, profilePicture: e.target.value})} placeholder="https://example.com/logo.png" />
                    {formData.profilePicture && <img src={formData.profilePicture} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                  <input type="url" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f84464] outline-none" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} placeholder="https://example.com/banner.jpg" />
                  {formData.bannerUrl && (
                    <div className="mt-2 w-full h-24 rounded-lg bg-gray-100 overflow-hidden border">
                      <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <button disabled={isLoading} type="submit" className="flex items-center gap-2 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-70">
                <Save className="w-5 h-5" />
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
