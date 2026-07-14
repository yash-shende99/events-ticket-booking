"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Building2, Mail, Phone, Clock, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEnquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/enquiries")
        .then(res => res.json())
        .then(data => {
          setEnquiries(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const getEnquiryLabel = (type: string) => {
    switch(type) {
      case 'bulk_booking': return 'Bulk Ticket Booking';
      case 'private_screening': return 'Private Screening';
      case 'corporate_gifting': return 'Corporate Gifting';
      case 'theatre_partnership': return 'Theatre Partnership / Listing';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const getEnquiryColor = (type: string) => {
    switch(type) {
      case 'bulk_booking': return 'bg-blue-100 text-blue-700';
      case 'private_screening': return 'bg-purple-100 text-purple-700';
      case 'corporate_gifting': return 'bg-emerald-100 text-emerald-700';
      case 'theatre_partnership': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading enquiries...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Corporate & Theatre Enquiries</h1>
          </div>
          <p className="text-gray-500 ml-12">View and manage incoming partnership requests, bulk bookings, and theatre listings.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {enquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No enquiries yet</h3>
            <p className="text-gray-500">When someone fills out the Corporate form, it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enquiries.map((enq) => (
              <div key={enq._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEnquiryColor(enq.enquiryType)}`}>
                    {getEnquiryLabel(enq.enquiryType)}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{enq.companyName}</h3>
                <p className="text-sm text-gray-600 mb-4">{enq.firstName} {enq.lastName}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{enq.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{enq.mobile}</span>
                  </div>
                </div>

                {enq.message && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 relative group-hover:bg-gray-100 transition">
                    <FileText className="w-4 h-4 text-gray-400 absolute top-4 left-4" />
                    <p className="text-sm text-gray-700 pl-6 italic line-clamp-3">"{enq.message}"</p>
                  </div>
                )}

                <button 
                  onClick={() => toast.success("Marked as resolved!")}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
