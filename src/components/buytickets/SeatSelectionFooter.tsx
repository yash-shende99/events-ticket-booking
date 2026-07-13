"use client";

import { useState } from "react";
import TermsModal from "./TermsModal";
import { useRouter, useParams } from "next/navigation";

export default function SeatSelectionFooter({ 
  totalPrice = 0, 
  selectedCount = 0,
  maxSeats = 0,
  onProceed
}: { 
  totalPrice?: number;
  selectedCount?: number;
  maxSeats?: number;
  onProceed?: () => void;
}) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const isReady = selectedCount === maxSeats && maxSeats > 0;
  
  const router = useRouter();
  const params = useParams();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-green-500 bg-white rounded-sm"></div>
            <span className="text-xs text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-[#1ea83c] bg-[#1ea83c] rounded-sm"></div>
            <span className="text-xs text-gray-600 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-gray-200 bg-gray-200 rounded-sm"></div>
            <span className="text-xs text-gray-600 font-medium">Sold / Held</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsTermsOpen(true)}
          disabled={!isReady}
          className={`font-medium px-16 py-2.5 rounded shadow-sm transition ${
            isReady 
              ? 'bg-[#f84464] hover:bg-[#e03c5a] text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isReady ? `Pay ₹${totalPrice}` : 'Select Seats'}
        </button>
      </div>

      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => {
          setIsTermsOpen(false);
          if (onProceed) {
            onProceed();
          } else {
            router.push(`/movies/${params.id}/addons/${params.showtimeId}?total=${totalPrice}&seats=${maxSeats}`);
          }
        }}
      />
    </div>
  );
}
