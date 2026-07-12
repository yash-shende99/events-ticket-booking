"use client";

import { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSeats: (count: number) => void;
}

export default function SeatSelectionModal({ isOpen, onClose, onSelectSeats }: SeatSelectionModalProps) {
  const [seatCount, setSeatCount] = useState(2);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // BookMyShow vehicle illustrations based on seat count
  const renderVehicle = () => {
    const vehicles: Record<number, string> = {
      1: "🚲", // Bicycle
      2: "🛵", // Scooter
      3: "🛺", // Auto
      4: "🚗", // Car
      5: "🚙", // SUV
      6: "🚙", // SUV
      7: "🚙", // SUV
      8: "🚙", // SUV
      9: "🚙", // SUV
      10: "🚙" // SUV
    };
    
    return (
      <div className="w-32 h-24 mx-auto relative mb-4 flex items-center justify-center">
        <span className="text-6xl transition-all duration-300 transform scale-110">
          {vehicles[seatCount] || "🚗"}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-8 pb-8 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">How many seats?</h2>
          
          {renderVehicle()}
          
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setSeatCount(num)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  seatCount === num 
                    ? "bg-[#f84464] text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="w-full border-t border-gray-100 pt-6 relative">
            {/* Scrollable Categories */}
            <div className="flex items-center relative group w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); scroll("left"); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-10 h-10 bg-gray-600/90 rounded-full flex items-center justify-center shadow-md z-10 text-white hover:bg-gray-700 transition-colors opacity-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar px-6 w-full pb-4 snap-x scroll-smooth"
              >
                <div className="flex-1 min-w-[120px] snap-center flex flex-col items-center opacity-50">
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">RECLINER ROWS</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">₹800</span>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Sold Out</span>
                </div>
                <div className="flex-1 min-w-[120px] snap-center flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">PRIME PLUS</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">₹550</span>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Sold Out</span>
                </div>
                <div className="flex-1 min-w-[120px] snap-center flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">PRIME ROWS</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">₹470</span>
                  <span className="text-[10px] text-[#ff9900] mt-1 uppercase font-semibold">Almost Full</span>
                </div>
                <div className="flex-1 min-w-[120px] snap-center flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">CLASSIC PLUS</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">₹450</span>
                  <span className="text-[10px] text-[#ff9900] mt-1 uppercase font-semibold">Filling Fast</span>
                </div>
                <div className="flex-1 min-w-[120px] snap-center flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">CLASSIC ROWS</span>
                  <span className="text-sm font-bold text-gray-800 mt-1">₹360</span>
                  <span className="text-[10px] text-[#4abd5d] mt-1 uppercase font-semibold">Available</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); scroll("right"); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-10 h-10 bg-gray-600/90 rounded-full flex items-center justify-center shadow-md z-10 text-white hover:bg-gray-700 transition-colors opacity-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => onSelectSeats(seatCount)}
            className="w-full bg-[#f84464] text-white font-semibold py-3.5 rounded-md mt-6 shadow-[0_4px_12px_rgba(248,68,100,0.3)] hover:bg-[#e03c5a] transition"
          >
            Select Seats
          </button>
        </div>
      </div>
    </div>
  );
}
