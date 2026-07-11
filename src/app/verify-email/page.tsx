"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h2>
      
      {status === "loading" && (
        <p className="text-gray-600">{message}</p>
      )}
      
      {status === "success" && (
        <div>
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link href="/login" className="bg-[#f84464] text-white px-6 py-2 rounded-md font-medium hover:bg-[#e03a58] transition">
            Go to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <p className="text-red-600 mb-6">{message}</p>
          <Link href="/login" className="text-[#f84464] hover:underline">
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center text-gray-600">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
