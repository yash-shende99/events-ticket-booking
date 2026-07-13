"use client";

import { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { 
  TrendingUp, Users, Ticket, Film, Calendar, DollarSign, Percent, Clock
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserMenuClient from "@/components/UserMenuClient";

const COLORS = ['#f84464', '#e03a58', '#b82947', '#ff6b85', '#ffa6b8', '#ffccd5'];

export default function OrganiserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session.user.role !== "organiser") {
        router.push("/");
      } else {
        fetchStats();
      }
    }
  }, [status, router, session]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/organiser/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Navigation */}
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
            <h1 className="text-lg font-bold text-gray-700 tracking-tight">Organiser Analytics</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/organiser/create-event" className="text-sm font-medium text-white hover:bg-[#e03a58] bg-[#f84464] px-4 py-2 rounded-lg transition">
            + Create Listing
          </Link>
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tickets Sold</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.ticketsSold.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Seat Occupancy</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.seatOccupancy}%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Percent className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.todaysRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events listed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-[#f84464]">
              <Film className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Showtimes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingEvents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Waitlists</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingWaitlist}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Trend (Area Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (30 Days)</h3>
            <div className="h-80 w-full">
              {stats.revenueTrend && stats.revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueTrend}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f84464" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f84464" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} minTickGap={30} stroke="#9ca3af" />
                    <YAxis tick={{fontSize: 12}} tickFormatter={(val) => `₹${val}`} stroke="#9ca3af" />
                    <RechartsTooltip 
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f84464" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No revenue data available</div>
              )}
            </div>
          </div>

          {/* Ticket Sales Trend (Line Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Ticket Sales Trend (30 Days)</h3>
            <div className="h-80 w-full">
              {stats.ticketSalesTrend && stats.ticketSalesTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.ticketSalesTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} minTickGap={30} stroke="#9ca3af" />
                    <YAxis tick={{fontSize: 12}} stroke="#9ca3af" />
                    <RechartsTooltip 
                      formatter={(value) => [value, "Tickets Sold"]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line type="monotone" dataKey="tickets" stroke="#e03a58" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No ticket sales data available</div>
              )}
            </div>
          </div>

          {/* Category Wise Revenue (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Category Wise Revenue</h3>
            <div className="h-80 w-full">
              {stats.categoryRevenue && stats.categoryRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryRevenue.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `₹${value}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No category data available</div>
              )}
            </div>
          </div>

          {/* Event Comparison (Bar Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Events Comparison (Revenue vs Tickets)</h3>
            <div className="h-80 w-full">
              {stats.eventComparison && stats.eventComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.eventComparison}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" />
                    <YAxis yAxisId="left" tick={{fontSize: 12}} tickFormatter={(val) => `₹${val}`} stroke="#f84464" />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke="#10b981" />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#f84464" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="tickets" name="Tickets Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No event comparison data available</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
