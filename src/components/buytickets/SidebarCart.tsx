"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

interface SidebarCartProps {
  ticketTotal: number;
  foodTotal: number;
  isBooking: boolean;
  onProceed: () => void;
}

export default function SidebarCart({ ticketTotal, foodTotal, isBooking, onProceed }: SidebarCartProps) {
  const hasFood = foodTotal > 0;
  const grandTotal = ticketTotal + foodTotal;

  return (
    <div className="w-80 bg-white min-h-screen border-l shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <span className="text-sm text-gray-500 font-medium">Ticket(s) price</span>
        <span className="text-sm font-bold text-gray-800">₹{ticketTotal.toFixed(2)}</span>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Your Cart</h2>

        {!hasFood ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center -mt-10">
            <div className="relative w-32 h-32 mb-4 opacity-80">
              <span className="text-6xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">🍿</span>
            </div>
            <p className="text-sm text-gray-500 max-w-[200px]">Fill this cart with your favorite food combos!</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <span className="text-sm text-gray-600 font-medium">Food & Beverage</span>
              <span className="text-sm font-bold text-gray-800">₹{foodTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-auto pt-4 border-t border-dashed">
              <span>Amount Payable</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={onProceed}
              disabled={isBooking}
              className="w-full bg-[#f84464] hover:bg-[#e03c5a] disabled:bg-gray-400 text-white font-medium py-3 rounded shadow-sm transition mt-6 flex items-center justify-center gap-2"
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Finalizing...
                </>
              ) : (
                "Proceed"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
