import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Offer } from '@/models/Offer';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !subtotal) {
      return NextResponse.json({ error: 'Missing code or subtotal' }, { status: 400 });
    }

    await connectDB();

    const offer = await Offer.findOne({ code: code.toUpperCase(), isActive: true });

    if (!offer) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    let discount = 0;
    
    // Check if it's a percentage-based discount
    if (offer.discountPercentage) {
      discount = (subtotal * offer.discountPercentage) / 100;
      
      // Cap the discount at maxDiscount if defined
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else if (offer.maxDiscount) {
      // If no percentage but maxDiscount exists, treat it as a flat discount
      discount = offer.maxDiscount;
    }

    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);

    let message = `Coupon applied successfully!`;
    if (offer.maxDiscount && discount === offer.maxDiscount) {
      message = `50% applied (Capped at maximum ₹${offer.maxDiscount})`;
    }

    return NextResponse.json({
      success: true,
      discount: Math.round(discount),
      message
    });

  } catch (error) {
    console.error('Coupon Apply Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
