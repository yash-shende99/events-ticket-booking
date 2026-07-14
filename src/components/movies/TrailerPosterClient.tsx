"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export default function TrailerPosterClient({ 
  poster, 
  title, 
  releaseDate, 
  trailerUrl 
}: { 
  poster: string; 
  title: string; 
  releaseDate?: string; 
  trailerUrl?: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  let embedUrl = "";
  if (trailerUrl) {
    if (trailerUrl.includes("youtube.com/watch?v=")) {
      embedUrl = trailerUrl.replace("watch?v=", "embed/");
    } else if (trailerUrl.includes("youtu.be/")) {
      embedUrl = trailerUrl.replace("youtu.be/", "youtube.com/embed/");
    } else {
      embedUrl = trailerUrl; // assume it's already an embed link if neither match perfectly
    }
    
    // clean up any additional query params for safe embedding
    if (embedUrl.includes("&")) {
        embedUrl = embedUrl.split("&")[0];
    }
  }

  return (
    <>
      <div 
        className="shrink-0 w-[220px] group"
        onClick={() => {
          if (trailerUrl) setIsOpen(true);
        }}
      >
        <div
          className={`relative overflow-hidden shadow-2xl ${trailerUrl ? 'cursor-pointer' : ''}`}
          style={{ borderRadius: "16px 16px 0 0" }}
        >
          <Image
            src={poster}
            alt={title}
            width={220}
            height={330}
            className="w-full object-cover"
            style={{ height: 330, display: "block" }}
            unoptimized
            priority
          />
          {trailerUrl && (
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center border border-white/30">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
              <span className="text-white text-sm font-medium mt-2">Trailers</span>
            </div>
          )}
          {releaseDate && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#f84464]/90 text-white text-xs font-semibold text-center py-1.5">
              {String(releaseDate).toLowerCase().startsWith("releasing")
                ? releaseDate
                : `In cinemas: ${releaseDate}`}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition"
          >
            <X className="w-10 h-10" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/10">
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
