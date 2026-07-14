"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, IndianRupee, TrendingUp, CreditCard, Building2, Download, Receipt } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRevenue() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/revenue")
        .then(res => res.json())
        .then(resData => {
          setData(resData);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading financial data...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    // Create CSV content
    const headers = ["Metric,Amount (INR)\n"];
    const rows = [
      `Gross Revenue,${data.grossRevenue || 0}`,
      `Platform Fee,${data.platformFee || 0}`,
      `Organizer Share,${data.organizerShare || 0}`,
      `Taxes,${data.taxes || 0}`,
      `Refunds Issued,${data.refundsIssued || 0}`
    ];
    
    // In a real app we'd also loop through data.venues and data.movies here
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows.join("\n"));
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Revenue report downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Revenue Management</h1>
            </div>
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
          <p className="text-gray-500 ml-12">Track platform financials, commissions, and transaction history.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Gross Revenue</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data?.grossRevenue || 0)}</p>
            <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">+12.5% this month</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Platform Fee</h3>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data?.platformFee || 0)}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Your 10% earnings</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Organizer Share</h3>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building2 className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data?.organizerShare || 0)}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Payouts pending</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Refunds Issued</h3>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Receipt className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data?.totalRefunds || 0)}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Money returned</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Tickets Sold</h3>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Receipt className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data?.totalTicketsSold || 0}</p>
            <p className="text-sm text-gray-500 mt-2 font-medium">Across all events</p>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" /> Recent Transactions
            </h3>
            <Link href="/admin/bookings" className="text-sm font-medium text-[#f84464] hover:underline">View All Bookings</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm font-semibold text-gray-600">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Fee (10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentTransactions?.map((tx: any) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-900">{tx.bookingId}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{tx.user?.name}</p>
                      <p className="text-xs text-gray-500">{tx.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(tx.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-green-600">+{formatCurrency(tx.totalPrice * 0.10)}</span>
                    </td>
                  </tr>
                ))}
                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No recent transactions found.
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
