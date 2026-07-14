"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, RefreshCw, CheckCircle, ShieldCheck, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRefunds() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchRefunds();
    }
  }, [status, session, router]);

  const fetchRefunds = async () => {
    try {
      const res = await fetch("/api/admin/refunds");
      const data = await res.json();
      setRefunds(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleProcessRefund = async (ticketId: string) => {
    setProcessing(ticketId);
    try {
      const res = await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Refund processed successfully!");
      setRefunds(refunds.filter(r => r._id !== ticketId));
    } catch (error: any) {
      toast.error(error.message || "Failed to process refund");
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkRefund = () => {
    if(refunds.length === 0) return toast.error("No pending refunds to process.");
    toast.error("Bulk refund API not implemented yet", { icon: "⚠️" });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading pending refunds...</div>;
  }

  const totalPendingAmount = refunds.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
            </div>
            <button 
              onClick={handleBulkRefund}
              className="px-4 py-2 bg-[#f84464] hover:bg-red-600 text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Process All ({refunds.length})
            </button>
          </div>
          <p className="text-gray-500 ml-12">Review and process refunds for cancelled tickets or cancelled events.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-sm mb-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-gray-300 font-medium mb-1">Total Pending Refunds</h2>
            <p className="text-3xl font-bold">₹{totalPendingAmount}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm flex items-center gap-1 justify-end"><ShieldCheck className="w-4 h-4 text-green-400" /> Gateway Status: Operational</p>
            <p className="text-xs text-gray-400 mt-1">Stripe / Razorpay connected</p>
          </div>
        </div>

        {refunds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">There are no pending refunds waiting to be processed.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Booking ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Customer</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Event & Seats</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Refund Amount</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {refunds.map((refund) => (
                    <tr key={refund._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-gray-900">{refund.bookingId}</span>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-700">
                            PENDING REFUND
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{refund.user?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">{refund.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">{refund.movie?.title}</p>
                        <p className="text-xs text-gray-500">Seats: {refund.seats?.join(", ")}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-red-600">₹{refund.totalPrice}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleProcessRefund(refund._id)}
                          disabled={processing === refund._id}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm ml-auto"
                        >
                          {processing === refund._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {processing === refund._id ? "Processing..." : "Approve Refund"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
