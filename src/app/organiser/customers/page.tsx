"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, TrendingUp, Search } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";

export default function CustomersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCustomers();
    }
  }, [status, session, router]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/organiser/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Customers...</div>;

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
                  <Users className="w-6 h-6 text-[#f84464]" /> Customer Analytics
                </h1>
                <p className="text-sm text-gray-500">View your frequent customers and their total lifetime spend (Read-Only)</p>
              </div>
            </div>
            
            <div className="relative max-w-sm w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by customer name or email..." 
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
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4 text-center">Total Bookings</th>
                  <th className="px-6 py-4 text-center">Tickets Bought</th>
                  <th className="px-6 py-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.image ? (
                            <img src={customer.image} alt={customer.name} className="w-10 h-10 rounded-full object-cover border" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#f84464] text-white flex items-center justify-center font-bold">
                              {customer.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-900">
                        {customer.totalBookings}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                          {customer.totalTickets} Seats
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-gray-900 text-lg flex items-center justify-end gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" /> ₹{customer.totalSpend.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Last booked: {new Date(customer.lastBookingDate).toLocaleDateString()}</div>
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
