"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cms")
      .then(res => res.json())
      .then(data => {
        if (data?.homepageBanners?.length > 0) {
          setBanners(data.homepageBanners);
        } else {
          // Fallback banners if CMS is empty
          setBanners([
            "/assets/1783601830831_ks1240x300jpg.jpeg",
            "/assets/1778484693811_filmcitydesktop.jpeg"
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading || banners.length === 0) return null;

  return (
    <div className="w-full bg-gray-100 py-3">
      <div className="relative max-w-[1240px] mx-auto overflow-hidden rounded-lg cursor-pointer">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
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
          {banners.map((_, index) => (
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
