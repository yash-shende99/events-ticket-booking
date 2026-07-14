"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, QrCode, Search, CheckCircle2, XCircle, Clock, Calendar, MapPin, User, Ticket as TicketIcon } from "lucide-react";
import toast from "react-hot-toast";
import UserMenuClient from "@/components/UserMenuClient";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function QRValidationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ticketId, setTicketId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "organiser")) {
      router.push("/login");
    }
  }, [status, session, router]);

  const handleLookup = async (e?: React.FormEvent, idToLookup?: string) => {
    if (e) e.preventDefault();
    const id = idToLookup || ticketId.trim();
    if (!id) return;

    setIsSearching(true);
    setTicketData(null);
    try {
      const res = await fetch("/api/organiser/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, action: "LOOKUP" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setTicketData(data.ticket);
    } catch (error: any) {
      toast.error(error.message || "Ticket not found");
    } finally {
      setIsSearching(false);
    }
  };

  const onScan = (result: any) => {
    if (result && result.length > 0) {
      const scannedId = result[0].rawValue;
      let parsedId = scannedId;
      
      // Try to parse as JSON (in case QR contains an object)
      try {
        const jsonPayload = JSON.parse(scannedId);
        if (jsonPayload.bookingId) {
          parsedId = jsonPayload.bookingId;
        } else if (jsonPayload.ticketId) {
          parsedId = jsonPayload.ticketId;
        }
      } catch (e) {
        // Not JSON, just use the raw string
      }

      setTicketId(parsedId);
      setIsScanning(false);
      handleLookup(undefined, parsedId);
    }
  };

  const handleUpdateStatus = async (action: string) => {
    if (!ticketData) return;
    try {
      const res = await fetch("/api/organiser/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticketData._id, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Ticket status updated");
      setTicketData(data.ticket);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/organiser">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold tracking-tighter text-gray-900">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div>
            <h1 className="text-lg font-bold text-gray-700 tracking-tight">Organiser Hub</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/organiser" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Dashboard
          </Link>
          <UserMenuClient isAuthenticated={true} userName={session?.user?.name} />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
          <span>ℹ️</span> This section is for Theatre & Place Owners (Venue Management), not Event Organizers.
        </div>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-[#f84464]" /> Venue Entry Validation
            </h1>
            <p className="text-gray-500">Scan or enter ticket IDs to check-in customers at the venue.</p>
          </div>
        </div>

        {/* Scanner Input Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-[#f84464]" />
          </div>
          <h2 className="text-xl font-bold mb-6">Scan QR or Enter Booking ID</h2>
          
          {isScanning ? (
            <div className="max-w-md mx-auto mb-6 border-4 border-[#f84464] rounded-2xl overflow-hidden relative">
              <button 
                onClick={() => setIsScanning(false)}
                className="absolute top-2 right-2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <Scanner onScan={onScan} />
            </div>
          ) : (
            <button 
              onClick={() => setIsScanning(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition mx-auto mb-6"
            >
              <QrCode className="w-5 h-5" /> Open Camera Scanner
            </button>
          )}

          <div className="flex items-center gap-4 max-w-md mx-auto mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium">OR MANUALLY</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <form onSubmit={handleLookup} className="max-w-md mx-auto flex gap-2">
            <input 
              type="text" 
              autoFocus={!isScanning}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f84464] focus:ring-0 outline-none text-center font-mono text-lg tracking-wider"
              placeholder="e.g. BKG-123456"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-70"
            >
              {isSearching ? "..." : <Search className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">Hardware barcode scanners will automatically enter the ID here.</p>
        </div>

        {/* Ticket Result Box */}
        {ticketData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
            <div className={`p-4 text-center font-bold text-white ${
              ticketData.status === 'CONFIRMED' ? 'bg-green-500' :
              ticketData.status === 'USED' ? 'bg-blue-500' :
              ticketData.status === 'EXPIRED' ? 'bg-gray-500' :
              'bg-red-500'
            }`}>
              {ticketData.status === 'CONFIRMED' ? 'VALID TICKET - UNUSED' :
               ticketData.status === 'USED' ? 'ALREADY USED / CHECKED-IN' :
               ticketData.status === 'EXPIRED' ? 'TICKET EXPIRED' :
               'TICKET CANCELLED'}
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Movie Poster */}
                <div className="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden border">
                  <img src={ticketData.movie?.poster} alt="Poster" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticketData.movie?.title}</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><User className="w-4 h-4"/> Customer</p>
                      <p className="font-medium text-gray-900">{ticketData.user?.name || "Guest"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><TicketIcon className="w-4 h-4"/> Seats ({ticketData.seats?.length})</p>
                      <p className="font-bold text-gray-900 text-lg">{ticketData.seats?.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><Calendar className="w-4 h-4"/> Date & Time</p>
                      <p className="font-medium text-gray-900">{ticketData.showtime?.date} at {ticketData.showtime?.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><MapPin className="w-4 h-4"/> Venue</p>
                      <p className="font-medium text-gray-900">{ticketData.showtime?.theater?.name} (Screen: {ticketData.showtime?.screen})</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t">
                    {ticketData.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleUpdateStatus('MARK_USED')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Mark as Used (Check-in)
                      </button>
                    )}
                    
                    {ticketData.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => handleUpdateStatus('MARK_EXPIRED')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Clock className="w-5 h-5" /> Expire
                      </button>
                    )}

                    {(ticketData.status === 'USED' || ticketData.status === 'EXPIRED') && (
                      <div className="flex-1 bg-gray-50 text-gray-500 py-3 rounded-xl font-medium text-center border border-gray-200">
                        No actions available. Ticket is {ticketData.status.toLowerCase()}.
                      </div>
                    )}
                    
                    {ticketData.status === 'CANCELLED' && (
                      <div className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-center border border-red-100">
                        Ticket is CANCELLED. Do not allow entry.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
