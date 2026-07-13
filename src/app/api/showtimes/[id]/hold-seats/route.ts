import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { SeatHold } from "@/models/SeatHold";
import { Ticket } from "@/models/Ticket";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "guest-" + Math.random().toString(36).substring(7);
    
    const { seats } = await req.json();
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: "Invalid seats provided" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if seats are already booked in a confirmed Ticket
    const existingTicket = await Ticket.findOne({
      showtime: id,
      status: "CONFIRMED",
      seats: { $in: seats }
    });

    if (existingTicket) {
      return NextResponse.json({ error: "One or more selected seats are already booked." }, { status: 409 });
    }

    // 2. Check if seats are currently held by someone else
    const now = new Date();
    const existingHold = await SeatHold.findOne({
      showtimeId: id,
      seatId: { $in: seats },
      expiresAt: { $gt: now },
      userId: { $ne: userId } // It's okay if WE hold them
    });

    if (existingHold) {
      return NextResponse.json({ error: "One or more selected seats are currently being held by another user." }, { status: 409 });
    }

    // 3. Create or refresh holds for the requested seats
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

    // First delete any expired or existing holds for this user for these seats to avoid duplicate key errors
    await SeatHold.deleteMany({
      showtimeId: id,
      $or: [
        { seatId: { $in: seats } },
        { expiresAt: { $lte: now } }
      ]
    });

    // Insert new holds
    const holdDocs = seats.map(seatId => ({
      showtimeId: id,
      seatId,
      userId,
      expiresAt
    }));

    await SeatHold.insertMany(holdDocs);

    return NextResponse.json({ success: true, message: "Seats held successfully", expiresAt });

  } catch (error: any) {
    console.error("Error holding seats:", error);
    // Handle MongoDB duplicate key error for concurrency
    if (error.code === 11000) {
      return NextResponse.json({ error: "Seats were just taken by another user." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to hold seats" }, { status: 500 });
  }
}
