"use client";

import { Ticket as TicketIcon } from "lucide-react";

export default function DownloadTicketButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg text-center transition flex items-center justify-center gap-2"
    >
      <TicketIcon className="w-5 h-5" /> Download E-Ticket
    </button>
  );
}
