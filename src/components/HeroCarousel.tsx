"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const BANNERS = [
  "/assets/1783601830831_ks1240x300jpg.jpeg",
  "/assets/1778484693811_filmcitydesktop.jpeg",
  "/assets/1783745848188_rehmateinweb.jpeg",
  "/assets/1783423607108_mumbaiweb.jpeg"
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-100 py-3">
      <div className="relative max-w-[1240px] mx-auto overflow-hidden rounded-lg cursor-pointer">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div key={index} className="w-full shrink-0">
              <Image 
                src={banner} 
                alt={`Banner ${index + 1}`} 
                width={1240} 
                height={300} 
                className="w-full h-auto object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
