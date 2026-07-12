"use client";

import React, { useState } from 'react';
import { Tag, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface CouponInputProps {
  subtotal: number;
  onDiscountApplied: (discount: number, code: string) => void;
}

export default function CouponInput({ subtotal, onDiscountApplied }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsApplying(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch('/api/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid coupon code");
        setAppliedCode("");
        onDiscountApplied(0, "");
      } else {
        setSuccessMsg(data.message);
        setAppliedCode(code.trim().toUpperCase());
        onDiscountApplied(data.discount, code.trim().toUpperCase());
      }
    } catch (err) {
      setError("Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setAppliedCode("");
    setSuccessMsg("");
    setError("");
    onDiscountApplied(0, "");
  };

  if (subtotal === 0) return null;

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2 text-gray-800 font-bold mb-3">
        <Tag className="w-5 h-5 text-[#f84464]" />
        <span>Offers & Promos</span>
      </div>

      {appliedCode ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">{appliedCode} Applied!</p>
              <p className="text-xs text-green-600">{successMsg}</p>
            </div>
          </div>
          <button 
            onClick={handleRemove}
            className="text-xs font-bold text-red-500 hover:text-red-700 underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="ENTER COUPON CODE"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full border-2 border-gray-200 rounded-lg pl-4 pr-24 py-3 text-sm font-bold uppercase outline-none focus:border-[#f84464] transition-colors placeholder:font-normal placeholder:text-gray-400"
            />
            <button
              onClick={handleApply}
              disabled={isApplying || !code.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#f84464] text-white px-5 rounded-md text-sm font-bold hover:bg-[#e03c5a] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : "APPLY"}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-xs font-medium">
              <XCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
