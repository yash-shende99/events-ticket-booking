"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function InterestedButtonClient({ movieId }: { movieId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { status } = useSession();

  const fetchWishlist = () => {
    fetch('/api/wishlist').then(res => res.json()).then(data => {
      const isListed = data.movies?.some((m: any) => (m._id || m) === movieId);
      setIsWishlisted(!!isListed);
    }).catch(console.error);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [movieId, status]);

  useEffect(() => {
    const handleUpdate = () => {
      if (status === "authenticated") fetchWishlist();
    };
    window.addEventListener('wishlist-update', handleUpdate);
    return () => window.removeEventListener('wishlist-update', handleUpdate);
  }, [status]);

  const toggleWishlist = async () => {
    if (status === "unauthenticated") {
      toast.error("Please login to add to wishlist!", { icon: "🔒" });
      return;
    }

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
        toast.error("Please login to add to wishlist!", { icon: "🔒" });
      } else {
        window.dispatchEvent(new Event('wishlist-update'));
      }
    } catch(e) {
      console.error(e);
      setIsWishlisted(previousState);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`flex items-center gap-2 rounded-xl px-4 py-3 cursor-pointer transition ${
        isWishlisted ? 'bg-[#f84464]/20' : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      <Heart className={`w-5 h-5 ${isWishlisted ? 'text-[#f84464] fill-current' : 'text-[#f84464]'}`} />
      <span className="text-sm text-gray-300">I'm Interested</span>
    </button>
  );
}
