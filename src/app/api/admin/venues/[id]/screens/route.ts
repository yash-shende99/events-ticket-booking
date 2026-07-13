import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Theater } from "@/models/Theater";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const venueId = params.id;
    const { name, capacity, categories } = await req.json();

    if (!name || !capacity) {
      return NextResponse.json({ error: "Screen name and capacity are required" }, { status: 400 });
    }

    const venue = await Theater.findById(venueId);
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // Default to at least one 'Standard' category if none provided
    const defaultCategories = categories && categories.length > 0 
      ? categories 
      : [{ name: "Standard", priceMultiplier: 1 }];

    venue.screens.push({
      name,
      capacity: Number(capacity),
      categories: defaultCategories
    });

    await venue.save();

    return NextResponse.json({ success: true, venue }, { status: 201 });
  } catch (error: any) {
    console.error("Screen Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const venueId = params.id;
    const url = new URL(req.url);
    const screenId = url.searchParams.get("screenId");

    if (!screenId) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }

    const venue = await Theater.findById(venueId);
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    venue.screens = venue.screens.filter((s: any) => s._id.toString() !== screenId);
    await venue.save();

    return NextResponse.json({ success: true, venue }, { status: 200 });
  } catch (error: any) {
    console.error("Screen Deletion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
