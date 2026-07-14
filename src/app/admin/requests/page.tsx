"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      toast.error("Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Request ${status}!`);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold tracking-tighter text-gray-900">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div>
            <h1 className="text-lg font-bold text-gray-700 tracking-tight">Global Headquarters</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Command Center
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Inbox className="w-8 h-8 text-[#f84464]" /> Organizer Requests
              </h1>
              <p className="text-gray-500">Review and approve new Movie and Event listings from Organizers.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-6">Listing Details</th>
                  <th className="p-6">Type</th>
                  <th className="p-6">Requested Date</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading requests...</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">No pending requests right now.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={req.poster} alt={req.title} className="w-12 h-16 object-cover rounded-md border shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{req.title}</p>
                            <p className="text-sm text-gray-500">Requested by Organizer</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {req.eventType || "Event"}
                        </span>
                      </td>
                      <td className="p-6 text-gray-600 font-medium">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-6">
                        {req.status === "Pending Admin Approval" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-4 h-4" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-4 h-4" /> Approved
                          </span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ml-auto"
                        >
                          <Eye className="w-4 h-4" /> Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Review Request</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-6 mb-8">
                <img src={selectedRequest.poster} alt={selectedRequest.title} className="w-32 rounded-xl shadow-md border" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {selectedRequest.eventType || "Event"}
                    </span>
                    <span className="text-gray-500 font-medium text-sm">{selectedRequest.duration}</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">{selectedRequest.title}</h3>
                  <p className="text-gray-600 mb-2">{selectedRequest.about}</p>
                  <p className="text-sm text-gray-500 font-medium">Genres: {selectedRequest.genres.join(", ")}</p>
                  <p className="text-sm text-gray-500 font-medium">Languages: {selectedRequest.languages.join(", ")}</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Proposed Base Pricing</h4>
                {selectedRequest.basePricing && selectedRequest.basePricing.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRequest.basePricing.map((price: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                        <span className="font-bold text-gray-700">{price.category}</span>
                        <span className="font-black text-[#f84464]">₹{price.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No base pricing provided.</p>
                )}
              </div>

              {selectedRequest.status === "Pending Admin Approval" ? (
                <div className="flex gap-4 border-t pt-6">
                  <button 
                    onClick={() => handleUpdateStatus(selectedRequest._id, "Rejected")}
                    className="flex-1 py-3 bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Reject Request
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedRequest._id, "Approved")}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Approve Listing
                  </button>
                </div>
              ) : (
                <div className="border-t pt-6 text-center">
                  <span className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-50 px-6 py-3 rounded-xl border border-green-200">
                    <CheckCircle2 className="w-5 h-5" /> This listing is already Approved.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
