"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DateSelector() {
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

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex items-center">
        <button className="p-2 text-gray-400 hover:text-gray-900 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-1 overflow-x-auto hide-scrollbar gap-2 px-2">
          {dates.map((d, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button 
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex flex-col items-center justify-center min-w-[60px] h-[64px] rounded-xl transition ${
                  isSelected 
                    ? "bg-[#f84464] text-white shadow-md" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className={`text-[10px] font-semibold tracking-wider ${isSelected ? 'text-white' : 'text-gray-500'}`}>{d.day}</span>
                <span className="text-xl font-bold leading-tight">{d.date}</span>
                <span className={`text-[10px] font-semibold tracking-wider ${isSelected ? 'text-white' : 'text-gray-500'}`}>{d.month}</span>
              </button>
            );
          })}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-900 transition">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="border-l pl-4 ml-2 flex gap-4 text-sm font-medium text-gray-600">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase">Filter</span>
            <span className="cursor-pointer hover:text-gray-900">Price Range</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase">Filter</span>
            <span className="cursor-pointer hover:text-gray-900">Show Timings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
