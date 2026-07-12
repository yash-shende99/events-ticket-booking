"use client";

import { useState } from "react";

export default function SeatLayoutGrid({ 
  maxSeats, 
  selectedSeats,
  onSeatSelect 
}: { 
  maxSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seatId: string, price: number) => void;
}) {

  // Generate a mock seat map
  const renderRow = (rowLabel: string, count: number, price: number, offset: number = 0, isSoldOut: boolean = false) => {
    return (
      <div key={rowLabel} className="flex items-center gap-6 mb-2">
        <div className="w-4 text-xs font-semibold text-gray-400">{rowLabel}</div>
        <div className="flex items-center gap-2" style={{ paddingLeft: `${offset}px` }}>
          {Array.from({ length: count }).map((_, i) => {
            const seatId = `${rowLabel}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isAvailable = !isSoldOut;

            return (
              <button
                key={seatId}
                disabled={!isAvailable}
                onClick={() => onSeatSelect(seatId, price)}
                className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-medium transition-colors border
                  ${!isAvailable ? 'bg-gray-200 border-gray-200 text-transparent cursor-not-allowed' : 
                    isSelected ? 'bg-[#1ea83c] border-[#1ea83c] text-white shadow-sm' : 
                    'bg-white border-green-500 text-green-700 hover:bg-green-50'
                  }
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center pt-8 overflow-y-auto overflow-x-auto px-8 pb-32">
      
      {/* Category 1 */}
      <div className="w-full max-w-4xl mb-8">
        <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹800 Recliner Rows</div>
        <div className="flex flex-col opacity-60 pointer-events-none">
          {renderRow('A', 14, 800, 0, true)}
        </div>
      </div>

      {/* Category 2 */}
      <div className="w-full max-w-4xl mb-12">
        <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹450 Classic Plus Rows</div>
        <div className="flex flex-col">
          {renderRow('B', 16, 450, 20)}
          {renderRow('C', 18, 450, 0)}
          {renderRow('D', 18, 450, 0)}
          {renderRow('E', 18, 450, 0)}
          {renderRow('F', 18, 450, 0)}
        </div>
      </div>

      {/* Category 3 */}
      <div className="w-full max-w-4xl">
        <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹360 Classic Rows</div>
        <div className="flex flex-col">
          {renderRow('G', 20, 360, 0)}
          {renderRow('H', 20, 360, 0)}
          {renderRow('I', 20, 360, 0)}
          {renderRow('J', 22, 360, -10)}
        </div>
      </div>

      {/* Screen Graphic */}
      <div className="w-full max-w-md mt-16 mb-8 flex flex-col items-center">
        <div className="w-full h-1 bg-gradient-to-b from-gray-300 to-transparent shadow-[0_10px_20px_rgba(0,0,0,0.1)] rounded-full"></div>
        <span className="text-xs text-gray-400 mt-4 uppercase tracking-widest font-medium">All eyes this way please!</span>
      </div>
    </div>
  );
}
