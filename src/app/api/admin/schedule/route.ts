import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Showtime } from "@/models/Showtime";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    const {
      eventId,
      theaterId,
      screen,
      capacity,
      date,
      timings, // Array of strings like ["10:00 AM", "03:00 PM"]
      pricing,
      dynamicPricing
    } = data;

    // Verify the event exists
    const event = await Movie.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!timings || !Array.isArray(timings) || timings.length === 0) {
      return NextResponse.json({ error: "Must provide at least one show timing" }, { status: 400 });
    }

    // Bulk construct Showtime documents
    const showtimesToCreate = timings.map(time => ({
      movie: eventId,
      theater: theaterId,
      screen,
      capacity,
      date,
      time,
      format: event.formats && event.formats.length > 0 ? event.formats[0] : "2D",
      language: event.languages && event.languages.length > 0 ? event.languages[0] : "English",
      pricing,
      dynamicPricing,
      status: "available"
    }));

    const inserted = await Showtime.insertMany(showtimesToCreate);

    // After scheduling, update the Event status to Published!
    event.status = "Published";
    await event.save();

    return NextResponse.json({ success: true, count: inserted.length, showtimes: inserted }, { status: 201 });
  } catch (error: any) {
    console.error("Admin Schedule Engine Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
