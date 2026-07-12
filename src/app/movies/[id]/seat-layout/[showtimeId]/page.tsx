"use client";

import { useState, use } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import SeatLayoutGrid from "@/components/buytickets/SeatLayoutGrid";
import SeatSelectionFooter from "@/components/buytickets/SeatSelectionFooter";

export default function SeatLayoutPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ id: string; showtimeId: string }>;
  searchParams: Promise<{ seats?: string; time?: string; date?: string; theater?: string }>;
}) {
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);

  const seatsToSelect = parseInt(searchParams.seats || "2", 10);
  const time = searchParams.time || "11:05 PM";
  const date = searchParams.date || "Sat, 11 July, 2026";
  const theater = searchParams.theater || "INOX Megaplex Phoenix Mall";

  // State for seat selection
  const [selectedSeats, setSelectedSeats] = useState<{id: string, price: number}[]>([]);

  // Calculate total price
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatSelect = (seatId: string, price: number) => {
    const isSelected = selectedSeats.find(s => s.id === seatId);
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
    } else {
      if (selectedSeats.length < seatsToSelect) {
        setSelectedSeats(prev => [...prev, { id: seatId, price }]);
      } else {
        // Deselect oldest and select new one if limit reached
        setSelectedSeats(prev => [...prev.slice(1), { id: seatId, price }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link 
              href={`/movies/${params.id}/buytickets`}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Movie Title - (Hindi)</h1>
              <p className="text-xs text-gray-500 mt-0.5">{theater} | {date} | {time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="border border-gray-300 rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              {seatsToSelect} Tickets
            </button>
          </div>
        </div>
        
        {/* Format/Time Pills */}
        <div className="bg-gray-50 px-14 py-2 border-t flex gap-3 overflow-x-auto hide-scrollbar">
          <button className="px-4 py-1.5 border border-green-500 rounded text-center min-w-[90px] bg-white">
            <div className="text-[#4abd5d] text-xs font-semibold">{time}</div>
            <div className="text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">Atmos</div>
          </button>
        </div>
      </header>

      {/* Main Seat Grid */}
      <main className="flex-1 w-full overflow-hidden flex flex-col bg-gray-50 pb-24">
        <SeatLayoutGrid 
          maxSeats={seatsToSelect} 
          selectedSeats={selectedSeats.map(s => s.id)}
          onSeatSelect={handleSeatSelect}
        />
      </main>

      {/* Sticky Footer */}
      <SeatSelectionFooter 
        totalPrice={totalPrice} 
        selectedCount={selectedSeats.length}
        maxSeats={seatsToSelect}
      />
    </div>
  );
}
