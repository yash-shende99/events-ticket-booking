"use client";

import { useState, use, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
  const router = useRouter();

  const seatsToSelect = parseInt(searchParams.seats || "2", 10);
  const time = searchParams.time || "11:05 PM";
  const date = searchParams.date || "Sat, 11 July, 2026";
  const theater = searchParams.theater || "INOX Megaplex Phoenix Mall";

  // State for seat selection
  const [selectedSeats, setSelectedSeats] = useState<{id: string, price: number}[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [heldSeats, setHeldSeats] = useState<string[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [layout, setLayout] = useState<string[][]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch seat status
  const fetchSeatStatus = async () => {
    try {
      const res = await fetch(`/api/showtimes/${params.showtimeId}/seats-status`);
      const data = await res.json();
      if (data.success) {
        setBookedSeats(data.bookedSeats || []);
        setHeldSeats(data.heldSeats || []);
        if (data.layout) setLayout(data.layout);
        if (data.categories) setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch seat status", error);
    }
  };

  useEffect(() => {
    fetchSeatStatus();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchSeatStatus, 5000);
    return () => clearInterval(interval);
  }, [params.showtimeId]);

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

  const handleProceed = async () => {
    if (selectedSeats.length !== seatsToSelect) return;
    
    setIsHolding(true);
    const loadingToast = toast.loading("Securing your seats...");

    try {
      const seatIds = selectedSeats.map(s => s.id);
      const res = await fetch(`/api/showtimes/${params.showtimeId}/hold-seats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seats: seatIds })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error(data.error || "Someone else just grabbed these seats!", { id: loadingToast });
        // Clear selection and refresh map
        setSelectedSeats([]);
        fetchSeatStatus();
        setIsHolding(false);
        return;
      }

      toast.success("Seats secured! You have 10 minutes to complete checkout.", { id: loadingToast });
      
      // Navigate to checkout/addons
      const seatString = seatIds.join(",");
      router.push(`/movies/${params.id}/addons/${params.showtimeId}?total=${totalPrice}&seats=${seatString}`);

    } catch (error) {
      console.error(error);
      toast.error("An error occurred while securing seats.", { id: loadingToast });
      setIsHolding(false);
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
          bookedSeats={bookedSeats}
          heldSeats={heldSeats}
          layout={layout}
          categories={categories}
          onSeatSelect={handleSeatSelect}
        />
      </main>

      {/* Sticky Footer */}
      <SeatSelectionFooter 
        totalPrice={totalPrice} 
        selectedCount={selectedSeats.length}
        maxSeats={seatsToSelect}
        onProceed={handleProceed}
      />
    </div>
  );
}
