"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Calendar, Users, Film, Activity, LogOut, Building2, IndianRupee, TrendingUp, ShieldAlert, RefreshCw, Megaphone, LayoutDashboard, ShieldCheck, Settings, Tag } from "lucide-react";
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
          <Link href="/admin/schedules" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Schedule Engine</h3>
            <p className="text-gray-500 text-sm">Deploy and manage showtimes across all venues and screens.</p>
          </Link>

          {/* Bookings Card */}
          <Link href="/admin/bookings" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Management</h3>
            <p className="text-gray-500 text-sm">Track all ticket sales, manage cancellations, and monitor payment statuses.</p>
          </Link>

          {/* Waitlists Card */}
          <Link href="/admin/waitlists" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Waitlist Monitoring</h3>
            <p className="text-gray-500 text-sm">Monitor demand queues for sold-out shows and trigger custom offer emails.</p>
          </Link>

          {/* Offers & Coupons CMS */}
          <Link href="/admin/offers" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Tag className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offers & Coupons</h3>
            <p className="text-gray-500 text-sm">Create, manage, and toggle promo codes and dynamic offers globally.</p>
          </Link>

          {/* Revenue Card */}
          <Link href="/admin/revenue" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Management</h3>
            <p className="text-gray-500 text-sm">Track gross revenue, platform fees, taxes, and generate financial reports.</p>
          </Link>

          {/* Analytics Dashboard */}
          <Link href="/admin/analytics" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-500 text-sm">Monitor occupancy %, ticket conversions, and revenue per hall.</p>
          </Link>

          {/* Refund Management */}
          <Link href="/admin/refunds" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Refund Management</h3>
            <p className="text-gray-500 text-sm">Approve bulk refunds for cancelled bookings and failed payments.</p>
          </Link>

          {/* User Management */}
          <Link href="/admin/users" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-500 text-sm">Search directory, view details, and suspend/ban malicious accounts.</p>
          </Link>

          {/* Notification Center */}
          <Link href="/admin/notifications" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notification Center</h3>
            <p className="text-gray-500 text-sm">Dispatch global broadcasts, promo emails, and waitlist offers.</p>
          </Link>

          {/* CMS Management */}
          <Link href="/admin/cms" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Content Management</h3>
            <p className="text-gray-500 text-sm">Manage homepage banners, featured movies, and promotions.</p>
          </Link>

          {/* System Settings */}
          <Link href="/admin/settings" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">System Configuration</h3>
            <p className="text-gray-500 text-sm">Manage core platform variables like platform fee and waitlist expiry.</p>
          </Link>

          {/* Venue Management Card */}
          <Link href="/admin/venues">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#f84464] transition cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-red-50 text-[#f84464] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Venue & Screen Management</h3>
              <p className="text-gray-500 text-sm">Create physical theaters, cinemas, and manage internal screens (e.g., Audi 1, IMAX).</p>
            </div>
          </Link>

          {/* Corporate Enquiries Card */}
          <Link href="/admin/enquiries">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-500 transition cursor-pointer group h-full">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate & Theatre Requests</h3>
              <p className="text-gray-500 text-sm">Review incoming contact requests from theaters looking to partner with CineVerse.</p>
            </div>
          </Link>

          {/* Organiser Venue Requests Card */}
          <Link href="/admin/venue-requests">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-500 transition cursor-pointer group h-full">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Venue Requests</h3>
              <p className="text-gray-500 text-sm">Review screening venue requests from Event Organisers.</p>
            </div>
          </Link>

          {/* Organiser Event Requests Card */}
          <Link href="/admin/requests">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-amber-500 transition cursor-pointer group h-full">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Event Listing Requests</h3>
              <p className="text-gray-500 text-sm">Review and approve new movie or event listings before they are published.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
