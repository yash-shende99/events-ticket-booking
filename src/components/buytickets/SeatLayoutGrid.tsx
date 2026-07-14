"use client";

import { useState } from "react";

export default function SeatLayoutGrid({ 
  maxSeats, 
  selectedSeats,
  bookedSeats = [],
  heldSeats = [],
  layout = [],
  categories = [],
  onSeatSelect 
}: { 
  maxSeats: number;
  selectedSeats: string[];
  bookedSeats?: string[];
  heldSeats?: string[];
  layout?: string[][];
  categories?: any[];
  onSeatSelect: (seatId: string, price: number) => void;
}) {

  // Fallback mock seat map if no layout is provided by the DB
  const renderMockRow = (rowLabel: string, count: number, price: number, offset: number = 0, isSoldOut: boolean = false) => {
    return (
      <div key={rowLabel} className="flex items-center gap-6 mb-2">
        <div className="w-4 text-xs font-semibold text-gray-400">{rowLabel}</div>
        <div className="flex items-center gap-2" style={{ paddingLeft: `${offset}px` }}>
          {Array.from({ length: count }).map((_, i) => {
            const seatId = `${rowLabel}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isBooked = bookedSeats.includes(seatId) || isSoldOut;
            const isHeld = heldSeats.includes(seatId);
            const isAvailable = !isBooked && !isHeld;

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

  const renderDynamicGrid = () => {
    return layout.map((rowArr, rIndex) => {
      const rowLabel = String.fromCharCode(65 + rIndex); // A, B, C
      const validSeats = rowArr.filter(c => c !== "Gap");
      if (validSeats.length === 0) {
        return <div key={`gap-${rIndex}`} className="h-6"></div>;
      }
      
      return (
        <div key={rowLabel} className="flex items-center gap-6 mb-2 justify-center">
          <div className="w-4 text-xs font-semibold text-gray-400 text-right">{rowLabel}</div>
          <div className="flex items-center gap-2">
            {rowArr.map((cellCategory, cIndex) => {
              if (cellCategory === "Gap" || !cellCategory) {
                return <div key={`empty-${cIndex}`} className="w-6 h-6" />;
              }

              const seatId = `${rowLabel}${cIndex + 1}`;
              const isSelected = selectedSeats.includes(seatId);
              const isBooked = bookedSeats.includes(seatId);
              const isHeld = heldSeats.includes(seatId);
              const isAvailable = !isBooked && !isHeld;

              // Fallback pricing logic matching standard category prices
              let price = 360; 
              if (cellCategory === "Premium") price = 800;
              else if (cellCategory === "Standard") price = 450;
              else if (cellCategory === "Economy") price = 250;
              else if (cellCategory === "Recliner") price = 900;
              else if (cellCategory === "Platinum") price = 1000;
              else if (cellCategory === "Gold") price = 600;
              else if (cellCategory === "Silver") price = 350;

              return (
                <button
                  key={seatId}
                  disabled={!isAvailable}
                  onClick={() => onSeatSelect(seatId, price)}
                  title={`${seatId} - ${cellCategory} (₹${price})`}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-medium transition-colors border
                    ${!isAvailable ? 'bg-gray-200 border-gray-200 text-transparent cursor-not-allowed' : 
                      isSelected ? 'bg-[#1ea83c] border-[#1ea83c] text-white shadow-sm' : 
                      'bg-white border-green-500 text-green-700 hover:bg-green-50'
                    }
                  `}
                >
                  {cIndex + 1}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const hasLayout = layout && layout.length > 0;

  return (
    <div className="flex-1 w-full flex flex-col items-center pt-8 overflow-y-auto overflow-x-auto px-8 pb-32">
      
      {hasLayout ? (
        <div className="w-full max-w-5xl mb-8 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider text-center">Seat Map</div>
          <div className="inline-flex flex-col">
            {renderDynamicGrid()}
          </div>
        </div>
      ) : (
        <>
          {/* Fallback mock categories */}
          <div className="w-full max-w-4xl mb-8">
            <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹800 Recliner Rows</div>
            <div className="flex flex-col opacity-60 pointer-events-none">
              {renderMockRow('A', 14, 800, 0, true)}
            </div>
          </div>

          <div className="w-full max-w-4xl mb-12">
            <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹450 Classic Plus Rows</div>
            <div className="flex flex-col">
              {renderMockRow('B', 16, 450, 20)}
              {renderMockRow('C', 18, 450, 0)}
              {renderMockRow('D', 18, 450, 0)}
              {renderMockRow('E', 18, 450, 0)}
              {renderMockRow('F', 18, 450, 0)}
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider border-b pb-2">₹360 Classic Rows</div>
            <div className="flex flex-col">
              {renderMockRow('G', 20, 360, 0)}
              {renderMockRow('H', 20, 360, 0)}
              {renderMockRow('I', 20, 360, 0)}
              {renderMockRow('J', 22, 360, -10)}
            </div>
          </div>
        </>
      )}

      {/* Screen Graphic */}
      <div className="w-full max-w-md mt-16 mb-8 flex flex-col items-center">
        <div className="w-full h-1 bg-gradient-to-b from-gray-300 to-transparent shadow-[0_10px_20px_rgba(0,0,0,0.1)] rounded-full"></div>
        <span className="text-xs text-gray-400 mt-4 uppercase tracking-widest font-medium">All eyes this way please!</span>
      </div>
    </div>
  );
}
