import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Showtime } from "@/models/Showtime";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseDurationToMins(durationStr: string): number {
  if (!durationStr) return 120; // Default 2 hours
  const str = durationStr.toLowerCase();
  let totalMins = 0;
  
  const hoursMatch = str.match(/(\d+)h/);
  if (hoursMatch) totalMins += parseInt(hoursMatch[1]) * 60;
  
  const minsMatch = str.match(/(\d+)m/);
  if (minsMatch) totalMins += parseInt(minsMatch[1]);
  
  if (totalMins === 0) {
    // maybe it's just a number
    const num = parseInt(str);
    if (!isNaN(num)) totalMins = num;
    else totalMins = 120;
  }
  return totalMins;
}

function parseTimeToMinsFromMidnight(timeStr: string): number {
  // Parses "10:00 AM" to 600
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + mins;
}

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

    const movieDurationMins = parseDurationToMins(event.duration);
    const CLEANING_BUFFER_MINS = 30;
    const totalSlotMins = movieDurationMins + CLEANING_BUFFER_MINS;

    // Fetch existing showtimes for the same theater, screen, and date
    const existingShowtimes = await Showtime.find({
      theater: theaterId,
      screen: screen,
      date: date
    });

    // Check for overlaps
    for (const requestedTimeStr of timings) {
      const reqStartMins = parseTimeToMinsFromMidnight(requestedTimeStr);
      const reqEndMins = reqStartMins + totalSlotMins;

      for (const existingShow of existingShowtimes) {
        // We need existing show's duration. If we don't have it on Showtime model, fetch its movie
        // Wait, to be safe, assume standard 150 mins if not easily available, or fetch it.
        // Actually, we can fetch the existing movie durations to be exact.
        const existingMovie = await Movie.findById(existingShow.movie);
        const exDurationMins = existingMovie ? parseDurationToMins(existingMovie.duration) : 120;
        
        const exStartMins = parseTimeToMinsFromMidnight(existingShow.time);
        const exEndMins = exStartMins + exDurationMins + CLEANING_BUFFER_MINS;

        // Overlap logic: newStart < exEnd AND newEnd > exStart
        if (reqStartMins < exEndMins && reqEndMins > exStartMins) {
          return NextResponse.json({ 
            error: `Double Booking Conflict! Slot ${requestedTimeStr} overlaps with an existing show at ${existingShow.time}.` 
          }, { status: 400 });
        }
      }
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
