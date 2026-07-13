"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Calendar, Users, Film, Activity, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || status === "unauthenticated" || session?.user?.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Controls...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center cursor-pointer text-gray-900">
            <span className="text-3xl font-bold tracking-tighter">
              Cine<span className="text-[#f84464]">Verse</span>
            </span>
          </div>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <Shield className="w-5 h-5 text-[#f84464]" /> Admin Control
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm font-medium">Welcome, {session.user.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-gray-600 hover:text-[#f84464] transition flex items-center gap-2 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-lg">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Platform Command Center</h2>
          <p className="text-gray-500">Oversee global schedules, manage users, and monitor platform health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Schedule Engine Card */}
          <Link href="/admin/schedule">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#f84464] transition cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-red-50 text-[#f84464] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Schedule Engine</h3>
              <p className="text-gray-500 text-sm">Map pending organiser events to physical theaters and deploy platform-wide pricing models.</p>
            </div>
          </Link>

          {/* Placeholder Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Organisers</h3>
            <p className="text-gray-500 text-sm">Approve or suspend organiser accounts and manage payouts. (Coming soon)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="w-12 h-12 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Content Moderation</h3>
            <p className="text-gray-500 text-sm">Review event posters, banners, and descriptions for platform compliance. (Coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
