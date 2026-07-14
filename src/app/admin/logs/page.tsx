"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Search, ShieldCheck, Clock, Activity, FileText } from "lucide-react";

export default function AdminAuditLogs() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }
    if (status === "authenticated") fetchLogs();
  }, [status, session, router]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading secure audit trail...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-600" /> Audit Logs
              </h1>
              <p className="text-sm text-gray-500 mt-1">Immutable security ledger of all administrative actions.</p>
            </div>
          </div>
          
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by action, details, or admin name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm w-48">Timestamp</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Administrator</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Action Type</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm w-1/2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> 
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.admin?.name || "System"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 font-mono text-xs font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      {log.details}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No logs match your search criteria.
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
