"use client";

import React, { useState } from "react";
import { User as UserIcon, MapPin, Shield, ChevronRight, ChevronDown, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsClient({ initialUser }: { initialUser: any }) {
  const router = useRouter();
  
  // State for which section is expanded
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState(initialUser.name || "");
  const [location, setLocation] = useState(initialUser.defaultLocation || "Pune");
  const [marketing, setMarketing] = useState(initialUser.privacySettings?.marketing ?? true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const CITIES = ["Pune", "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad", "Chennai"];

  const handleSave = async (data: any) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh(); // Refresh server session if needed
      } else {
        alert("Failed to save settings.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const SETTING_SECTIONS = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Update your name, email, and personal details.",
      icon: <UserIcon className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
      content: (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f84464]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Read Only)</label>
            <input 
              type="email" 
              value={initialUser.email}
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <button 
            onClick={() => handleSave({ name })}
            disabled={isSaving}
            className="mt-4 bg-[#f84464] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e03c5a] transition-colors flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      )
    },
    {
      id: "location",
      title: "Saved Locations",
      description: "Manage your default city for faster bookings.",
      icon: <MapPin className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
      content: (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Default City</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CITIES.map(city => (
              <div 
                key={city}
                onClick={() => setLocation(city)}
                className={`px-4 py-3 border rounded-lg cursor-pointer text-center font-medium transition-colors ${location === city ? 'border-[#f84464] bg-red-50 text-[#f84464]' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
              >
                {city}
              </div>
            ))}
          </div>
          <button 
            onClick={() => handleSave({ defaultLocation: location })}
            disabled={isSaving}
            className="mt-6 bg-[#f84464] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e03c5a] transition-colors flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Location"}
          </button>
        </div>
      )
    },
    {
      id: "permissions",
      title: "Permissions & Privacy",
      description: "Control what data you share with us.",
      icon: <Shield className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
      content: (
        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Marketing Communications</h4>
              <p className="text-sm text-gray-500">Receive emails and SMS about new movies, events, and exclusive offers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84464]"></div>
            </label>
          </div>
          <button 
            onClick={() => handleSave({ marketingPreferences: marketing })}
            disabled={isSaving}
            className="mt-4 bg-[#f84464] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e03c5a] transition-colors flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Privacy Settings"}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      {saveSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 font-medium text-sm z-10 flex items-center justify-center gap-2 animate-fade-in-down">
          <Check className="w-4 h-4" /> Successfully saved!
        </div>
      )}

      <div className="p-6 border-b border-gray-100 bg-gray-50/50 mt-2">
        <h2 className="text-xl font-bold text-gray-900">Accounts & Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings.</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {SETTING_SECTIONS.map((section) => (
          <div key={section.id} className="transition-all duration-300">
            {/* Header / Clickable row */}
            <div 
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="p-6 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#f84464] transition-colors">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              {expandedSection === section.id ? (
                <ChevronDown className="w-5 h-5 text-[#f84464] shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedSection === section.id && (
              <div className="px-6 pb-6 pt-2 bg-gray-50/30">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
