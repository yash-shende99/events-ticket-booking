import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Waitlist } from "@/models/Waitlist";
import { Showtime } from "@/models/Showtime";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id; // Optional

    const body = await req.json();
    const { showtimeId, email, phone, seatsNeeded, category } = body;

    if (!showtimeId || !email || !seatsNeeded) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Verify showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }

    // Check if user is already on the waitlist for this showtime
    const existingEntry = await Waitlist.findOne({
      showtimeId,
      email,
      status: "waiting"
    });

    if (existingEntry) {
      return NextResponse.json({ error: "You are already on the waitlist for this showtime!" }, { status: 409 });
    }

    const waitlistEntry = await Waitlist.create({
      showtimeId,
      userId,
      email,
      phone,
      seatsNeeded,
      category,
      status: "waiting"
    });

    return NextResponse.json({ success: true, waitlistId: waitlistEntry._id });
  } catch (error: any) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
