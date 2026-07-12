"use client";

import React, { useState, useEffect } from "react";
import { Share2, Heart } from "lucide-react";

export default function MovieActionsClient({ movieId }: { movieId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetch('/api/wishlist').then(res => res.json()).then(data => {
      if (data.movies?.includes(movieId)) setIsWishlisted(true);
    }).catch(console.error);
  }, [movieId]);

  const toggleWishlist = async () => {
    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: movieId, type: 'MOVIE' })
      });
      if (res.status === 401) {
        setIsWishlisted(false);
        alert("Please sign in to add to your wishlist!");
      }
    } catch(e) {
      console.error(e);
      setIsWishlisted(previousState);
    }
  };

  return (
    <div className="self-start pt-2 flex flex-col gap-6">
      <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition">
        <Share2 className="w-6 h-6" />
        <span className="text-xs">Share</span>
      </button>
      <button onClick={toggleWishlist} className={`flex flex-col items-center gap-1 transition ${isWishlisted ? 'text-[#f84464]' : 'text-white/70 hover:text-white'}`}>
        <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
        <span className="text-xs">Wishlist</span>
      </button>
    </div>
  );
}
