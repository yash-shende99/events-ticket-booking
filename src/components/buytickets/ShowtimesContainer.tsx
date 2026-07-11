"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Info, Search, Heart, MapPin, Smartphone } from "lucide-react";

const THEATERS = [
  {
    name: "Cinepolis: Nexus Seawoods, Nerul, Navi Mumbai",
    amenities: ["M-Ticket", "Food & Beverage"],
    shows: [
      { time: "09:25 PM", type: "Cancellation available", status: "available" },
      { time: "10:25 PM", type: "Cancellation available", status: "available" },
      { time: "11:15 PM", type: "Cancellation available", status: "filling", isLate: true },
      { time: "11:50 PM", type: "Cancellation available", status: "available", isLate: true }
    ]
  },
  {
    name: "Cinepolis: Lake Shore, Thane (EX Viviana Mall)",
    amenities: ["M-Ticket"],
    shows: [
      { time: "08:30 PM", type: "2K LASER DOLBY 7.1", status: "available" },
      { time: "09:40 PM", type: "2K LASER DOLBY 7.1", status: "available" },
      { time: "10:40 PM", type: "ATMOS", status: "available" },
      { time: "11:10 PM", type: "2K LASER DOLBY 7.1", status: "almost-full", isLate: true }
    ]
  },
  {
    name: "BMX Cinemas(BalajiMovieplex): Littleworld Kharghar",
    amenities: ["M-Ticket", "Food & Beverage"],
    shows: [
      { time: "08:30 PM", type: "ATMOS", status: "available" },
      { time: "10:30 PM", type: "Cancellation available", status: "available" },
      { time: "11:30 PM", type: "Cancellation available", status: "available", isLate: true }
    ]
  },
  {
    name: "INOX Megaplex: Sky City Mall, Borivali",
    amenities: ["M-Ticket", "Food & Beverage", "Recliner"],
    shows: [
      { time: "08:10 PM", type: "Cancellation available", status: "available" },
      { time: "09:15 PM", type: "INSIGNIA", status: "available" },
      { time: "10:15 PM", type: "Cancellation available", status: "available" },
      { time: "11:15 PM", type: "Cancellation available", status: "available", isLate: true }
    ]
  },
  {
    name: "INOX: R-City, Ghatkopar",
    amenities: ["M-Ticket", "Food & Beverage", "Recliner"],
    shows: [
      { time: "07:40 PM", type: "KOTAK INSIGNIA", status: "available" },
      { time: "08:40 PM", type: "ENG", status: "available" },
      { time: "09:45 PM", type: "LASER", status: "available" },
      { time: "10:45 PM", type: "KOTAK INSIGNIA", status: "available" },
      { time: "11:45 PM", type: "LASER", status: "almost-full", isLate: true }
    ]
  }
];

export default function ShowtimesContainer() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Generate 7 days starting from today
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    return {
      day: dayNames[d.getDay()],
      date: d.getDate().toString().padStart(2, '0'),
      month: monthNames[d.getMonth()]
    };
  });

  // To simulate different dates having different data, we shuffle or slice the theaters array
  const displayedTheaters = [...THEATERS];
  // Shift array slightly based on date index to look dynamic
  for (let i = 0; i < selectedIdx; i++) {
    displayedTheaters.push(displayedTheaters.shift()!);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Date & Filter Strip */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Dates */}
          <div className="flex items-center pl-2">
            <button className="p-2 text-gray-300 hover:text-[#f84464] transition mr-3">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 py-2">
              {dates.map((d, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex flex-col items-center justify-center w-[56px] h-[68px] rounded-xl transition duration-300 ease-out ${
                      isSelected 
                        ? "bg-[#f84464] text-white shadow-[0_4px_12px_rgba(248,68,100,0.3)] scale-105" 
                        : "bg-transparent hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <span className={`text-[9px] font-medium tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>{d.day}</span>
                    <span className="text-[22px] font-semibold leading-none my-[2px]">{d.date}</span>
                    <span className={`text-[9px] font-medium tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>{d.month}</span>
                  </button>
                );
              })}
            </div>
            <button className="p-2 text-gray-300 hover:text-[#f84464] transition ml-3">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Filters */}
          <div className="flex items-center h-[84px]">
            <div className="h-full border-l border-gray-100 flex items-center px-5 hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-600 transition">
              Hindi - 2D <ChevronRight className="w-3.5 h-3.5 ml-2 rotate-90 opacity-60" />
            </div>
            <div className="h-full border-l border-gray-100 flex items-center px-5 hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-600 transition">
              Filter Price <ChevronRight className="w-3.5 h-3.5 ml-2 rotate-90 opacity-60" />
            </div>
            <div className="h-full border-l border-gray-100 flex items-center px-5 hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-600 transition">
              Filter Showtimes <ChevronRight className="w-3.5 h-3.5 ml-2 rotate-90 opacity-60" />
            </div>
            <div className="h-full border-l border-r border-gray-100 flex items-center px-6 hover:bg-gray-50 cursor-pointer text-gray-400 transition">
              <Search className="w-4 h-4 hover:text-gray-700" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Theater List Area */}
      <div className="bg-[#fdfdfd] min-h-screen pb-24">
        <div className="max-w-7xl mx-auto pt-6 pb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Header Legend */}
            <div className="bg-white px-8 py-4 border-b border-gray-100 flex items-center justify-end gap-8 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-[#4abd5d] shadow-[0_0_6px_rgba(74,189,93,0.4)]"></div> Available</span>
              <span className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-[#ff9900] shadow-[0_0_6px_rgba(255,153,0,0.4)]"></div> Fast Filling</span>
              <span className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-[#f84464] shadow-[0_0_6px_rgba(248,68,100,0.4)]"></div> Almost Full</span>
            </div>

            {/* List */}
            <div>
              {displayedTheaters.map((theater, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 p-8 flex flex-col md:flex-row gap-8 bg-white hover:bg-[#fafafa] transition duration-300">
                  <div className="md:w-[35%]">
                    <div className="flex items-start gap-4">
                      <Heart className="w-5 h-5 text-gray-300 hover:text-[#f84464] hover:fill-[#f84464]/10 cursor-pointer flex-shrink-0 mt-0.5 transition" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-[14px] flex items-center gap-2 hover:text-[#f84464] transition cursor-pointer leading-snug">
                          {theater.name}
                          <Info className="w-3.5 h-3.5 text-gray-300" />
                        </h3>
                        <div className="mt-3.5 flex flex-wrap gap-5 text-[11px]">
                          {theater.amenities.includes("M-Ticket") && (
                            <span className="flex items-center gap-1.5 text-[#4abd5d] font-medium">
                              <Smartphone className="w-3.5 h-3.5" /> M-Ticket
                            </span>
                          )}
                          {theater.amenities.includes("Food & Beverage") && (
                            <span className="flex items-center gap-1.5 text-[#ff9900] font-medium">
                              F&B
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-[65%] flex flex-wrap gap-4 items-center">
                    {theater.shows.map((show, sIdx) => {
                      // Modern aesthetic variables
                      let textColor = "text-[#4abd5d]";
                      let borderColor = "border-gray-200 hover:border-[#4abd5d]";
                      let hoverBg = "hover:bg-[#4abd5d]/5";
                      
                      if (show.status === "filling") {
                        textColor = "text-[#ff9900]";
                        borderColor = "border-[#ff9900]/40 hover:border-[#ff9900]";
                        hoverBg = "hover:bg-[#ff9900]/5";
                      }
                      if (show.status === "almost-full") {
                        textColor = "text-[#f84464]";
                        borderColor = "border-[#f84464]/40 hover:border-[#f84464]";
                        hoverBg = "hover:bg-[#f84464]/5";
                      }

                      return (
                        <div key={sIdx} className="relative group cursor-pointer">
                          {show.isLate && (
                            <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full w-[16px] h-[16px] flex items-center justify-center text-white text-[9px] z-10 shadow-sm transition group-hover:bg-gray-600">
                              ☾
                            </div>
                          )}
                          <div className={`px-4 py-2.5 rounded-lg border ${borderColor} ${hoverBg} bg-white flex flex-col items-center justify-center min-w-[100px] transition-all duration-300 ease-out group-hover:shadow-sm group-hover:-translate-y-[1px]`}>
                            <span className={`text-[13px] font-semibold ${textColor} tracking-tight`}>{show.time}</span>
                            <span className="text-[8.5px] font-medium text-gray-400 mt-1 uppercase text-center leading-tight max-w-[85px] tracking-widest">{show.type}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
