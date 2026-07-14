"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, AlertTriangle, ShieldAlert, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminConflicts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/admin/conflicts")
        .then(res => res.json())
        .then(data => {
          setAlerts(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const handleResolve = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert marked as resolved!");
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Scanning for system anomalies...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Conflict Management Center</h1>
          </div>
          <p className="text-gray-500 ml-12">Intelligent AI scanning for hall conflicts, overbooking, and revenue leaks.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {alerts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Systems Operational</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">No conflicts, overbookings, or payment spikes detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alert: any) => (
              <div 
                key={alert.id} 
                className={`relative overflow-hidden rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  alert.type === 'CRITICAL' 
                    ? 'bg-red-50/50 border-red-200' 
                    : 'bg-yellow-50/50 border-yellow-200'
                }`}
              >
                {/* Decorative side bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${alert.type === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {alert.type === 'CRITICAL' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{alert.title}</h3>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{alert.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="px-6 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all shadow-sm whitespace-nowrap text-sm"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className={`px-6 py-2 font-medium rounded-xl transition-all shadow-sm whitespace-nowrap text-sm text-white ${
                      alert.type === 'CRITICAL' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
