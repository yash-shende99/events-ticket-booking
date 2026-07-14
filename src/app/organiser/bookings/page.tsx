"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Ticket, CheckCircle2, XCircle, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";

export default function BookingsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, session, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/organiser/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => 
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Organiser Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
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

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-[#f84464]" /> Booking Management
                </h1>
                <p className="text-sm text-gray-500">View real-time ticket sales across your events (Read-Only)</p>
              </div>
            </div>
            
            <div className="relative max-w-sm w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by customer name or booking ID..." 
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#f84464] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">QR Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">{booking.bookingId || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.user?.name || "Guest User"}</div>
                        <div className="text-xs text-gray-500">{booking.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 max-w-[200px] truncate" title={booking.movie?.title}>{booking.movie?.title}</div>
                        <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                          <span>{booking.showtime?.date} at {booking.showtime?.time}</span>
                          <span>{booking.showtime?.theater?.name} • {booking.showtime?.screen}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {booking.seats?.map((seat: string) => (
                            <span key={seat} className="text-xs font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{seat}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{booking.totalPrice}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {booking.status === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                            <XCircle className="w-3 h-3" /> {booking.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {booking.status === "CONFIRMED" ? (
                          <button disabled className="p-2 bg-gray-100 text-gray-400 rounded-lg mx-auto block cursor-not-allowed" title="View-Only Mode">
                            <QrCode className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
