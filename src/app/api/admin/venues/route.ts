import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Theater } from "@/models/Theater";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const venues = await Theater.find().sort({ createdAt: -1 });
    return NextResponse.json(venues);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { name, city, address, amenities } = await req.json();

    if (!name || !city || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const venue = await Theater.create({
      name,
      city,
      address,
      amenities: amenities || [],
      screens: [] // Initialize with empty screens
    });

    return NextResponse.json({ success: true, venue }, { status: 201 });
  } catch (error: any) {
    console.error("Venue Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
