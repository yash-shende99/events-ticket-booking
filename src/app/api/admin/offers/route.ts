import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Offer } from "@/models/Offer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const offers = await Offer.find().sort({ createdAt: -1 });
    return NextResponse.json(offers);
  } catch (error: any) {
    console.error("Fetch offers error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();
    
    // Check for duplicate promo code if provided
    if (data.code) {
      const existing = await Offer.findOne({ code: data.code });
      if (existing) {
        return NextResponse.json({ error: "Promo code already exists" }, { status: 400 });
      }
    }

    const offer = await Offer.create(data);
    return NextResponse.json(offer, { status: 201 });
  } catch (error: any) {
    console.error("Create offer error:", error);
    return NextResponse.json({ error: error.message || "Failed to create offer" }, { status: 500 });
  }
}
