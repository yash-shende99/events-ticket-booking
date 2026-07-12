"use client";

import { useState, use } from "react";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import FoodBeverageList from "@/components/buytickets/FoodBeverageList";
import SidebarCart from "@/components/buytickets/SidebarCart";
import { useRouter, usePathname, useSearchParams as useNextSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AddonsPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ id: string; showtimeId: string }>;
  searchParams: Promise<{ total?: string; seats?: string; time?: string; date?: string; theater?: string }>;
}) {
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);

  const ticketTotal = parseInt(searchParams.total || "0", 10);
  const seatsToSelect = parseInt(searchParams.seats || "2", 10);
  
  // Dynamic Showtime State
  const [showtime, setShowtime] = useState<any>(null);
  const [isLoadingShowtime, setIsLoadingShowtime] = useState(true);

  useEffect(() => {
    async function fetchShowtime() {
      try {
        const res = await fetch(`/api/showtimes/${params.showtimeId}`);
        const data = await res.json();
        if (res.ok) {
          setShowtime(data);
        }
      } catch (err) {
        console.error("Failed to fetch showtime", err);
      } finally {
        setIsLoadingShowtime(false);
      }
    }
    fetchShowtime();
  }, [params.showtimeId]);

  // State for food items and filtering
  const [foodTotal, setFoodTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useNextSearchParams();
  const { status } = useSession();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async (amountToPay: number) => {
    if (status === "unauthenticated") {
      setShowLoginModal(true);
      return;
    }

    setIsBooking(true);
    
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Failed to load Razorpay SDK. Check your connection.");
        setIsBooking(false);
        return;
      }

      // Create Order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountToPay }),
      });
      const order = await orderRes.json();

      if (order.error) {
        alert("Order Creation Failed");
        setIsBooking(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Events Booking",
        description: "Movie Ticket Purchase",
        order_id: order.id,
        handler: async function (response: any) {
          setIsGenerating(true);
          try {
            const bookingRes = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                movieId: params.id,
                showtimeId: params.showtimeId,
                seats: seatsToSelect.toString(),
                time: showtime?.time || "11:05 PM",
                totalPrice: amountToPay,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const data = await bookingRes.json();
            if (bookingRes.ok) {
              router.push(`/movies/${params.id}/booking-success/${data.bookingId}`);
            } else {
              alert("Booking failed: " + data.error);
              setIsGenerating(false);
            }
          } catch (err) {
            console.error(err);
            alert("Error confirming booking.");
            setIsGenerating(false);
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: { color: "#f84464" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function () {
        setIsBooking(false);
      });

    } catch (err) {
      console.error(err);
      alert("An error occurred during booking.");
    }
    
    setIsBooking(false);
  };

  const categories = ["All", "Combos", "Snacks", "Beverages"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link 
              href={`/movies/${params.id}/seat-layout/${params.showtimeId}?seats=${seatsToSelect}&time=${encodeURIComponent(showtime?.time || "11:05 PM")}`}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              {isLoadingShowtime ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-5 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-lg font-semibold text-gray-800 tracking-tight">{showtime?.movie?.title} - ({showtime?.language})</h1>
                  <p className="text-xs text-gray-500 mt-0.5">{showtime?.theater?.name} | {showtime?.date} | {showtime?.time}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleProceed(ticketTotal)}
              disabled={isBooking}
              className="bg-[#f84464] hover:bg-[#e03c5a] disabled:bg-gray-400 text-white text-sm font-medium px-6 py-1.5 rounded shadow-sm transition"
            >
              {isBooking ? "Processing..." : "Skip"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content & Sidebar Wrapper */}
      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        
        {/* Left F&B Section */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          
          {/* Title & Search */}
          <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
            <h2 className="font-bold text-gray-800 text-xl">Grab a Bite!</h2>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search for F&B Items"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="max-w-5xl mx-auto mb-8 bg-[#0b8043] rounded-lg p-6 flex items-center justify-between shadow-sm overflow-hidden relative h-28">
            <div className="z-10 flex flex-col justify-center">
              <span className="text-yellow-300 font-bold text-xs tracking-widest uppercase mb-0.5">Unlimited</span>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-yellow-400 font-black text-4xl uppercase transform -skew-x-12">Refill</span>
                <span className="text-white font-black text-4xl uppercase transform -skew-x-12">Offer</span>
              </div>
              <span className="text-white font-semibold text-xs tracking-widest uppercase mt-1.5">Friday To Sunday</span>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-12 gap-2">
               <span className="text-6xl drop-shadow-md">🍿</span>
               <span className="text-5xl drop-shadow-md relative top-2">🥤</span>
            </div>
          </div>

          {/* Horizontal Tabs */}
          <div className="max-w-5xl mx-auto flex items-center gap-8 border-b mb-8 pb-1">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-2 text-sm transition relative ${
                  activeCategory === cat 
                    ? 'text-[#f84464] font-medium' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-[#f84464] rounded-t-sm"></div>
                )}
              </button>
            ))}
          </div>

          {/* F&B List */}
          <div className="max-w-5xl mx-auto">
            <FoodBeverageList activeCategory={activeCategory} searchQuery={searchQuery} onFoodTotalChange={setFoodTotal} />
          </div>
        </main>

        {/* Right Sidebar Cart */}
        <SidebarCart 
          ticketTotal={ticketTotal} 
          foodTotal={foodTotal} 
          isBooking={isBooking} 
          onProceed={() => handleProceed(ticketTotal + foodTotal)} 
        />
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-sm text-gray-500 mb-6">You must be logged in to complete your booking. Don't worry, your cart and selected seats will be saved!</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  const currentUrl = `${pathname}?${nextSearchParams.toString()}`;
                  router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
                }}
                className="w-full bg-[#f84464] hover:bg-[#e03c5a] text-white font-medium py-3 rounded-lg transition"
              >
                Login to Continue
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generating Ticket Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#f84464] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🍿</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Generating your Ticket...</h2>
          <p className="text-gray-500 font-medium">Please do not refresh the page.</p>
        </div>
      )}
    </div>
  );
}
