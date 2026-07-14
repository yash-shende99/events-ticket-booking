import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, CreditCard, Ticket, Clock, Star, Gift, ShieldCheck } from "lucide-react";
import connectDB from "@/lib/db";
import { Offer } from "@/models/Offer";
import CopyPromoCode from "@/components/offers/CopyPromoCode";

// Helper to map icon string to actual Lucide component
const getIconComponent = (iconName: string) => {
  const props = { className: "w-8 h-8 opacity-90" };
  switch (iconName) {
    case "CreditCard": return <CreditCard {...props} />;
    case "Ticket": return <Ticket {...props} />;
    case "Clock": return <Clock {...props} />;
    case "Star": return <Star {...props} />;
    case "Gift": return <Gift {...props} />;
    case "ShieldCheck": return <ShieldCheck {...props} />;
    case "Tag":
    default:
      return <Tag {...props} />;
  }
};

export default async function OffersPage() {
  await connectDB();
  
  // Fetch active offers from the database
  const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Exclusive Offers & Rewards</h1>
          <p className="text-lg text-gray-600">
            Discover the best deals on movie tickets, food, and beverages. Apply these promo codes at checkout to save big!
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Offers</h3>
              <p className="text-gray-500">Check back later for exciting discounts and promo codes!</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer._id.toString()} className={`p-8 rounded-3xl border shadow-sm transition-transform hover:-translate-y-1 ${offer.bgGradient}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-700">
                    {getIconComponent(offer.iconName || "Tag")}
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-100">
                    {offer.validity}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2">{offer.subtitle}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CopyPromoCode code={offer.code ? offer.code : "Auto-Applied"} />
                  
                  <Link 
                    href="/" 
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center whitespace-nowrap"
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Terms and Conditions Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            *Terms and conditions apply. Offers are subject to availability and may change without prior notice. <br />
            Bank offers are valid only for eligible cardholders.
          </p>
        </div>
        
      </div>
    </div>
  );
}
