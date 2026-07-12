import React from 'react';
import connectDB from '@/lib/db';
import { Offer } from '@/models/Offer';
import OffersListClient from '@/components/offers/OffersListClient';

export default async function OffersPage() {
  await connectDB();
  
  const rawOffers = await Offer.find({ isActive: true }).lean();
  
  const offers = rawOffers.map((o: any) => ({
    id: o._id.toString(),
    title: o.title,
    subtitle: o.subtitle,
    iconName: o.iconName,
    bgGradient: o.bgGradient,
    validity: o.validity,
    category: o.category
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <OffersListClient offers={offers} />
    </div>
  );
}
