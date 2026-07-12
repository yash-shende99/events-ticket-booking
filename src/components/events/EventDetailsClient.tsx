"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2, Calendar, Clock, MapPin, IndianRupee, Info } from "lucide-react";

export default function EventDetailsClient({ event }: { event: any }) {
  const [isBooking, setIsBooking] = useState(false);

  // Parse languages or default
  const languages = Array.isArray(event.languages) ? event.languages : [event.languages || "Marathi"];
  const category = event.category || "Concerts";
  const dateStr = event.date || "Sat 25 Jul 2026";
  const venue = event.location || "Ram Krishna More Auditorium: Pune";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ── HERO SECTION ── */}
      <section
        className="relative w-full bg-[#1a1a1a] overflow-hidden"
        style={{ minHeight: 480 }}
      >
        {/* Faint background poster */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${event.poster})` }}
        />
        {/* BMS gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #1A1A1A 24.97%, #1A1A1A 38.3%, rgba(26,26,26,0.04) 97.47%, #1A1A1A 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-start gap-8">
          {/* ── Poster ── */}
          <div className="shrink-0 w-[260px] mx-auto md:mx-0 group">
            <div
              className="relative overflow-hidden shadow-2xl"
              style={{ borderRadius: "16px 16px 0 0" }}
            >
              <Image
                src={event.poster}
                alt={event.title}
                width={260}
                height={390}
                className="w-full object-cover"
                style={{ height: 390, display: "block" }}
                unoptimized
                priority
              />
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col justify-center text-white flex-1 min-w-0 py-2">
            <h1 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-4">{event.title}</h1>

            {/* Category / Duration */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              <span className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-full">
                {category}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300 text-sm">2hrs 30mins</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300 text-sm">8yrs +</span>
            </div>

            {/* Price & Venue Sneak Peek */}
            <div className="bg-[#2b2b2b]/80 border border-white/10 rounded-xl p-4 mb-6 max-w-md backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-200 text-sm">{venue}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-200 text-sm">{event.price}</span>
              </div>
            </div>

            {/* Book Button */}
            <div>
              <button
                onClick={() => setIsBooking(true)}
                className="bg-[#f84464] hover:bg-[#e63c58] text-white font-semibold text-lg px-12 py-3.5 rounded-lg transition-colors w-full md:w-auto shadow-lg"
              >
                {isBooking ? "Loading Seats..." : "Book"}
              </button>
            </div>
          </div>

          {/* Share */}
          <div className="self-start pt-2 hidden md:block">
            <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium mt-1">Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTENT BELOW HERO ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1 max-w-4xl">
          
          {/* Info Grid (Date, Time, Language, etc) */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5 font-semibold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</div>
                <div className="font-medium text-gray-900 text-lg">{dateStr}</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5 font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time</div>
                <div className="font-medium text-gray-900 text-lg">5:30 PM</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Language</div>
                <div className="font-medium text-gray-900 text-lg">{languages.join(", ")}</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Category</div>
                <div className="font-medium text-gray-900 text-lg">{category}</div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200 mb-10" />

          {/* About */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Event</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              An evening of devotional melodies and the melodious court of classical ragas. 
              Enjoy a magnificent performance that will transport you to a world of musical bliss. 
              Join us for this special occasion and experience the magic live.
            </p>
          </section>

          <hr className="border-gray-200 mb-10" />

          {/* Terms & Conditions */}
          <section className="mb-12">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
             <ul className="list-none text-gray-700 text-base space-y-4">
               <li className="flex gap-3"><span className="text-[#f84464] font-bold">•</span> Tickets once booked cannot be exchanged or refunded.</li>
               <li className="flex gap-3"><span className="text-[#f84464] font-bold">•</span> Please carry a valid ID proof along with you.</li>
               <li className="flex gap-3"><span className="text-[#f84464] font-bold">•</span> Security procedures, including frisking remain the right of the management.</li>
               <li className="flex gap-3"><span className="text-[#f84464] font-bold">•</span> No dangerous or potentially hazardous objects including but not limited to weapons, knives, guns, fireworks, helmets, lazer devices, bottles, musical instruments will be allowed in the venue.</li>
             </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
