"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CouponInput from "../../buytickets/CouponInput";

type TicketTier = {
  id: string;
  name: string;
  price: number;
  status: "available" | "fast_filling" | "sold_out";
  description?: string;
};

export default function EventTicketsClient({ event }: { event: any }) {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  const basePrice = parseInt(String(event.price).replace(/[^0-9]/g, "")) || 499;

  const tickets: TicketTier[] = event?.basePricing?.length > 0 
    ? event.basePricing.map((bp: any, index: number) => ({
        id: `t${index + 1}`,
        name: bp.category,
        price: bp.price,
        status: "available",
        description: `Entry to the ${bp.category} arena.`,
      }))
    : [
    {
      id: "t1",
      name: "SILVER STANDING",
      price: basePrice,
      status: "fast_filling",
      description: "Entry to the silver standing arena.",
    },
    {
      id: "t2",
      name: "GOLD CHAIR",
      price: Math.floor(basePrice * 1.8),
      status: "available",
      description: "Seated entry in the gold section.",
    },
    {
      id: "t3",
      name: "EB PLATINUM CHAIR",
      price: Math.floor(basePrice * 2.5),
      status: "fast_filling",
      description: "Premium seated entry closer to the stage.",
    },
    {
      id: "t4",
      name: "EB VIP CHAIR",
      price: Math.floor(basePrice * 3.5),
      status: "available",
      description: "VIP seated entry with dedicated F&B service.",
    },
    {
      id: "t5",
      name: "EB SOFA",
      price: Math.floor(basePrice * 8),
      status: "available",
      description: "Plush sofa seating for maximum comfort.",
    },
    {
      id: "t6",
      name: "EARLY BIRD SILVER",
      price: Math.floor(basePrice * 0.8),
      status: "sold_out",
    }
  ];

  const handleAdd = (id: string) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemove = (id: string) => {
    setSelectedTickets((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const handleProceedToPay = async () => {
    if (status === "unauthenticated") {
      toast.error("Please login first to book tickets!", { icon: "🔒" });
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Failed to load Razorpay SDK. Check your connection.");
        setIsProcessing(false);
        return;
      }

      // Format selected tickets array
      const ticketsArray = Object.entries(selectedTickets).map(([id, count]) => {
        const ticket = tickets.find(t => t.id === id);
        return {
          tier: ticket?.name,
          count: count,
          price: ticket?.price
        };
      });

      const totalAmount = ticketsArray.reduce((acc, t) => acc + (t.price || 0) * t.count, 0) - discount;

      // 1. Create order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error("Failed to create order");

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: event.title || "Event Booking",
        description: "Ticket Booking",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify & Save
          const verifyRes = await fetch("/api/event-bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId: event._id,
              tickets: ticketsArray,
              totalPrice: totalAmount,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/events/${event._id}/booking-success/${verifyData.bookingId}`);
          } else {
            alert("Payment verification failed");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f84464",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setIsProcessing(false);
    }
  };

  const totalSelected = Object.values(selectedTickets).reduce((a, b) => a + b, 0);

  const subtotal = Object.entries(selectedTickets).reduce((total, [id, count]) => {
    const ticket = tickets.find(t => t.id === id);
    return total + ((ticket?.price || 0) * count);
  }, 0);

  const finalAmount = subtotal - discount;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-24">
      {/* Container */}
      <div className="max-w-4xl mx-auto pt-6 px-4">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{event.location}</h2>
            <p className="text-gray-500 text-sm mt-1">{event.date || "Sat 25 Jul"} | 05:30 PM</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
             <span className="text-sm text-gray-500 font-medium">Select Tickets</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-6 text-sm text-[#f84464] font-medium text-center">
          You can add up to 10 tickets only
        </div>

        {/* Tickets List */}
        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => {
            const count = selectedTickets[ticket.id] || 0;
            const isSoldOut = ticket.status === "sold_out";
            const isExpanded = expandedTiers[ticket.id];

            return (
              <div key={ticket.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-4 transition-colors hover:bg-gray-50/50 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                
                {/* Left Side: Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-[16px] mb-1">{ticket.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-800 text-[15px]">
                      {isSoldOut ? <span className="line-through text-gray-500">₹{ticket.price.toLocaleString()}</span> : `₹${ticket.price.toLocaleString()}`}
                    </span>
                    {ticket.status === "fast_filling" && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-orange-400 text-sm font-medium">Fast Filling</span>
                      </>
                    )}
                    {isSoldOut && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#f84464] text-sm font-bold">Sold out</span>
                      </>
                    )}
                  </div>
                  
                  {/* Know More Dropdown */}
                  {ticket.description && !isSoldOut && (
                    <div className="mt-2">
                      <button 
                        onClick={() => toggleExpand(ticket.id)}
                        className="text-[#f84464] text-[13px] font-medium flex items-center gap-1 hover:text-[#e63c58] transition-colors"
                      >
                        {isExpanded ? "Know less" : "Know more"}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isExpanded && (
                        <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600 text-sm">
                          <li>Grant Entry for 1</li>
                          <li>{ticket.description}</li>
                          <li>Inclusive of GST</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Action */}
                <div className="shrink-0 flex items-start justify-end mt-1 md:mt-0">
                  {isSoldOut ? null : count === 0 ? (
                    <button 
                      onClick={() => handleAdd(ticket.id)}
                      className="border border-[#f84464] text-[#f84464] hover:bg-[#f84464]/5 font-medium text-[15px] px-8 py-1.5 rounded transition-colors"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center border border-[#f84464] rounded overflow-hidden">
                      <button 
                        onClick={() => handleRemove(ticket.id)}
                        className="bg-[#f84464] text-white px-3 py-1.5 hover:bg-[#e63c58] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 font-semibold text-gray-800 w-10 text-center">{count}</span>
                      <button 
                        onClick={() => handleAdd(ticket.id)}
                        className="bg-[#f84464] text-white px-3 py-1.5 hover:bg-[#e63c58] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coupon Section */}
      {totalSelected > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <CouponInput 
            subtotal={subtotal} 
            onDiscountApplied={(discountAmount) => setDiscount(discountAmount)} 
          />
        </div>
      )}

      {/* Floating Bottom Bar (appears if tickets are selected) */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
           <div className="max-w-4xl mx-auto flex items-center justify-between">
             <div className="flex gap-6 items-center">
               <div>
                 <div className="text-sm text-gray-500">Subtotal</div>
                 <div className="font-bold text-lg text-gray-600">₹{subtotal.toLocaleString()}</div>
               </div>
               {discount > 0 && (
                 <div>
                   <div className="text-sm text-green-600 font-medium">Coupon</div>
                   <div className="font-bold text-lg text-green-600">- ₹{discount.toLocaleString()}</div>
                 </div>
               )}
               <div>
                 <div className="text-sm text-gray-900 font-bold">Total Amount</div>
                 <div className="font-bold text-xl text-gray-900">₹{finalAmount.toLocaleString()}</div>
               </div>
             </div>
             <button 
               onClick={handleProceedToPay}
               disabled={isProcessing || finalAmount === 0 && subtotal === 0}
               className={`bg-[#f84464] hover:bg-[#e63c58] text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center min-w-[180px] ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
             >
               {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proceed to Pay"}
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
