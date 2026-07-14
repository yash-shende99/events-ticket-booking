import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { VenueRequest } from "@/models/VenueRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await VenueRequest.find()
      .populate("organiserId", "name email company")
      .populate("movieId", "title poster")
      .populate("venueId", "name city screens")
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
