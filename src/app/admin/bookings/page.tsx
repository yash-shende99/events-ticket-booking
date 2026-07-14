"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, ArrowLeft, Ticket, Calendar, IndianRupee, XCircle, ShieldCheck, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchBookings();
    }
  }, [status, session, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (ticketId: string) => {
    if (!confirm("Are you sure you want to cancel this booking and initiate a refund?")) return;
    
    try {
      const res = await fetch(`/api/admin/bookings/${ticketId}/cancel`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Booking cancelled! Refund is now PENDING.");
      // Refresh list
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = 
      b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, User, or Movie..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(stat => (
                <button
                  key={stat}
                  onClick={() => setFilterStatus(stat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === stat 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Booking Info</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Customer</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Event & Venue</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Payment</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-sm font-bold text-gray-900">{booking.bookingId}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {booking.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{booking.user?.name || "Unknown User"}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {booking.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-gray-900 text-sm">{booking.movie?.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{booking.showtime?.theater?.name} • {booking.showtime?.theater?.city}</p>
                        <p className="text-xs font-medium text-[#f84464] mt-0.5">
                          {booking.seats?.length} Seats: {booking.seats?.join(", ")}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900">₹{booking.totalPrice}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-green-500" /> Paid
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <XCircle className="w-4 h-4" /> Cancel & Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p>No bookings found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
