import Link from "next/link";
import { CheckCircle2, Calendar, MapPin, Film, Ticket as TicketIcon } from "lucide-react";
import QRCode from "react-qr-code";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import DownloadTicketButton from "@/components/buytickets/DownloadTicketButton";

// Import models to ensure they are registered before population
import "@/models/Showtime";
import "@/models/Movie";
import "@/models/Theater";

export default async function BookingSuccessPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string; bookingId: string }>;
}) {
  const params = await paramsPromise;
  
  await connectDB();
  const ticket = await Ticket.findOne({ bookingId: params.bookingId })
    .populate({
      path: "showtime",
      populate: [
        { path: "movie" },
        { path: "theater" }
      ]
    })
    .lean();

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800">Booking Not Found</h1>
        <p className="text-gray-500 mt-2">We couldn't find a booking with ID: {params.bookingId}</p>
        <Link href="/" className="mt-6 text-[#f84464] hover:underline">Return to Home</Link>
      </div>
    );
  }

  const movie = ticket.showtime?.movie;
  const theater = ticket.showtime?.theater;
  const showtime = ticket.showtime;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header / Success Banner */}
        <div className="bg-[#0b8043] text-white p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Booking Confirmed!</h1>
          <p className="text-green-100 text-sm">
            Your QR Code ticket has been sent to your email.
          </p>
        </div>

        {/* Ticket Details */}
        <div className="p-6">
          <div className="border-b border-dashed border-gray-300 pb-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking ID</p>
                <p className="font-mono font-bold text-gray-900 text-lg">{params.bookingId}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-white">
                  <QRCode 
                    value={JSON.stringify({ bookingId: params.bookingId })}
                    size={80}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Scan at Entry</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Film className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">{movie?.title} - {showtime?.format}</h3>
                  <p className="text-sm text-gray-500">{showtime?.language}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{theater?.name}</h3>
                  <p className="text-xs text-gray-500">{theater?.location}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{showtime?.date} | {showtime?.time}</h3>
                </div>
              </div>

              <div className="flex gap-3">
                <TicketIcon className="w-5 h-5 text-[#f84464] shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#f84464] text-sm">Seats: {ticket.seats.join(", ")}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/"
              className="w-full bg-[#f84464] hover:bg-[#e03c5a] text-white font-medium py-3 rounded-lg text-center transition"
            >
              Back to Home
            </Link>
            <DownloadTicketButton />
          </div>

        </div>
      </div>
    </div>
  );
}
