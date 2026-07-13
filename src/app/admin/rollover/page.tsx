"use client";

import { useState } from "react";
import { PlayCircle, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminRolloverPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleRunJob = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/waitlist/rollover", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, error: data.error || "Failed to run job" });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-[#f84464]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Waitlist Rollover Engine</h1>
            <p className="text-sm text-gray-500">Manual Cron Trigger (Admin Only)</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex gap-3 text-orange-800 text-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-orange-500" />
          <p>
            This action instantly sweeps the database for expired Waitlist claims (where the user did not claim their seats within the 15-minute window). It revokes their holds and automatically assigns the seats to the <strong>next person in line</strong>, firing off a new email with a fresh 15-minute claim link.
          </p>
        </div>

        <button
          onClick={handleRunJob}
          disabled={isRunning}
          className="w-full bg-[#f84464] hover:bg-[#e03c5a] text-white font-semibold py-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isRunning ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <PlayCircle className="w-5 h-5" />
          )}
          {isRunning ? "Running Engine..." : "Run Rollover Job Now"}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Success' : 'Error'}
              </h3>
              <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message || result.error}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
