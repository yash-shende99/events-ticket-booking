"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyPromoCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code === "Auto-Applied") return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Promo code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className={`bg-white border-2 border-dashed px-4 py-2 rounded-xl text-center w-full sm:w-auto min-w-[150px] relative transition-colors ${
        code !== "Auto-Applied" ? "cursor-pointer hover:bg-gray-50 border-gray-300 hover:border-[#f84464] group" : "border-gray-200 opacity-80"
      }`}
      title={code !== "Auto-Applied" ? "Click to copy code" : ""}
    >
      <span className="text-xs text-gray-500 uppercase font-bold block mb-0.5 flex items-center justify-center gap-1">
        Promo Code
        {code !== "Auto-Applied" && (
          copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
      <span className={`text-lg font-black tracking-widest ${copied ? 'text-green-600' : 'text-gray-900'}`}>
        {code}
      </span>
    </div>
  );
}
