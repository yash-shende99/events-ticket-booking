import React from 'react';
import { CreditCard, Gift, Percent, Wallet, Tag, Popcorn, Building } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import { Offer } from '@/models/Offer';

// Helper to render icon string to lucide component
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

export default async function OffersAndDiscounts() {
  await connectDB();
  const rawOffers = await Offer.find({ isActive: true }).limit(4).lean();

  // Serialize IDs for client components if needed, or just plain object mapping
  const offers = rawOffers.map((o: any) => ({
    id: o._id.toString(),
    title: o.title,
    subtitle: o.subtitle,
    iconName: o.iconName,
    bgGradient: o.bgGradient,
    validity: o.validity,
    category: o.category
  }));

  if (offers.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Offers & Discounts</h2>
        <Link href="/offers" className="text-[#f84464] hover:underline text-sm font-medium">View All Offers</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group relative overflow-hidden"
          >
            {/* Subtle left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: offer.bgGradient }}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50">
                <div style={{ color: offer.bgGradient.includes('ec4899') ? '#e11d48' : offer.bgGradient.includes('2563eb') ? '#2563eb' : offer.bgGradient.includes('fbbf24') ? '#f97316' : '#0d9488' }}>
                  {renderIcon(offer.iconName, "w-6 h-6")}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1 group-hover:text-[#f84464] transition-colors">{offer.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{offer.subtitle}</p>
              <div className="inline-block bg-gray-50 border border-gray-100 rounded px-2 py-1">
                <p className="text-gray-600 text-xs font-medium">{offer.validity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
