"use client";

import React, { useState } from 'react';
import { CreditCard, Gift, Percent, Wallet, Tag, Popcorn, Building } from 'lucide-react';

const renderIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Percent': return <Percent className={className} color="currentColor" />;
    case 'CreditCard': return <CreditCard className={className} color="currentColor" />;
    case 'Wallet': return <Wallet className={className} color="currentColor" />;
    case 'Gift': return <Gift className={className} color="currentColor" />;
    case 'Building': return <Building className={className} color="currentColor" />;
    case 'Popcorn': return <Popcorn className={className} color="currentColor" />;
    case 'Tag': return <Tag className={className} color="currentColor" />;
    default: return <Tag className={className} color="currentColor" />;
  }
};

export default function OffersListClient({ offers }: { offers: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All Offers");

  const filteredOffers = activeFilter === "All Offers" 
    ? offers 
    : offers.filter(o => o.category === activeFilter);

  // Generate unique categories for the filter buttons
  const categories = ["All Offers", "Credit Card", "Wallets", "Promos", "F&B"];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exclusive Offers & Discounts</h1>
          <p className="text-gray-500">Save big on your next movie night or live event booking!</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === cat 
                  ? "bg-red-50 text-[#f84464] font-semibold border border-red-100" 
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOffers.map((offer) => (
          <div 
            key={offer.id} 
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group relative overflow-hidden animate-fade-in"
          >
            {/* Subtle left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: offer.bgGradient }}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50">
                <div style={{ color: offer.bgGradient.includes('ec4899') || offer.bgGradient.includes('f43f5e') ? '#e11d48' : offer.bgGradient.includes('2563eb') ? '#2563eb' : offer.bgGradient.includes('fbbf24') || offer.bgGradient.includes('eab308') ? '#f97316' : offer.bgGradient.includes('8b5cf6') ? '#7c3aed' : offer.bgGradient.includes('0ea5e9') ? '#0284c7' : '#0d9488' }}>
                  {renderIcon(offer.iconName, "w-6 h-6")}
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {offer.category}
              </span>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1 group-hover:text-[#f84464] transition-colors">{offer.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{offer.subtitle}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 border-t border-gray-50 pt-3">
                <Tag className="w-3 h-3 text-gray-400" />
                {offer.validity}
              </div>
            </div>
          </div>
        ))}

        {filteredOffers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No offers found for this category.
          </div>
        )}
      </div>

    </div>
  );
}
