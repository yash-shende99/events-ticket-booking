import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import SettingsClient from "@/components/profile/SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();
  
  const userDoc = await User.findById(session.user.id).lean();
  
  if (!userDoc) {
    redirect("/login");
  }

  // Serialize user data for client component
  const initialUser = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    defaultLocation: userDoc.defaultLocation || "Pune",
    privacySettings: userDoc.privacySettings || { marketing: true }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-tr from-[#f84464] to-orange-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {initialUser.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{initialUser.name}</h1>
              <p className="text-gray-500">{initialUser.email}</p>
            </div>
          </div>
        </div>

        {/* Interactive Settings Sections */}
        <SettingsClient initialUser={initialUser} />

        <div className="flex justify-center pt-4">
          <button className="text-red-500 hover:text-red-600 font-semibold text-sm transition-colors">
            Deactivate Account
          </button>
        </div>

      </div>
    </div>
  );
}
