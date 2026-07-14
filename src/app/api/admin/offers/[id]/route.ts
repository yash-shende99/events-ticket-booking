import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Offer } from "@/models/Offer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    await connectDB();
    
    // Check for duplicate promo code if changing it
    if (data.code) {
      const existing = await Offer.findOne({ code: data.code, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Promo code already exists" }, { status: 400 });
      }
    }

    const offer = await Offer.findByIdAndUpdate(id, data, { new: true });
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(offer);
  } catch (error: any) {
    console.error("Update offer error:", error);
    return NextResponse.json({ error: error.message || "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error: any) {
    console.error("Delete offer error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete offer" }, { status: 500 });
  }
}
