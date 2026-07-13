"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function CancelBookingButton({ bookingId, availableSeats = [] }: { bookingId: string, availableSeats: string[] }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCancel = async () => {
    if (selectedSeats.length === 0) return;
    
    setIsCancelling(true);
    const loadingToast = toast.loading("Cancelling selected seats...");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatsToCancel: selectedSeats }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Seats cancelled successfully.", { id: loadingToast });
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to cancel ticket.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("An error occurred.", { id: loadingToast });
    } finally {
      setIsCancelling(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isCancelling || availableSeats.length === 0}
        className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 transition disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" />
        {isCancelling ? "Cancelling..." : "Cancel Ticket"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Seats</h3>
            <p className="text-sm text-gray-500 mb-4">Select the specific seats you want to cancel from this booking.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {availableSeats.map((seat) => (
                <label key={seat} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-[#f84464] border-gray-300 rounded focus:ring-[#f84464]"
                    checked={selectedSeats.includes(seat)}
                    onChange={() => handleToggleSeat(seat)}
                  />
                  <span className="font-medium text-gray-700">{seat}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
              >
                Go Back
              </button>
              <button 
                onClick={handleCancel}
                disabled={selectedSeats.length === 0 || isCancelling}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium rounded-lg transition"
              >
                Cancel Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
