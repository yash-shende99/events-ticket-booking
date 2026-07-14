import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { VenueRequest } from "@/models/VenueRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await VenueRequest.find({ organiserId: session.user.id })
      .populate("movieId", "title poster")
      .populate("venueId", "name city")
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { movieId, venueId, screenId, startDate, endDate, capacityRequested, message } = await req.json();

    if (!movieId || !venueId || !screenId || !startDate || !endDate || !capacityRequested) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRequest = await VenueRequest.create({
      organiserId: session.user.id,
      movieId,
      venueId,
      screenId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      capacityRequested,
      message,
      status: "Pending"
    });

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
