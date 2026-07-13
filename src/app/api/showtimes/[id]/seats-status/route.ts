import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SeatHold } from "@/models/SeatHold";
import { Ticket } from "@/models/Ticket";
import { Showtime } from "@/models/Showtime";

export const dynamic = "force-dynamic";

// Helper to generate a deterministic pseudo-random number based on a string seed
function seededRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Fetch the showtime to check its mock status
    const showtime = await Showtime.findById(id).lean();

    // 1. Get all confirmed bookings for this showtime
    const tickets = await Ticket.find({
      showtime: id,
      status: "CONFIRMED"
    }).lean();

    const realBookedSeats = tickets.reduce((acc: string[], ticket) => {
      return acc.concat(ticket.seats);
    }, []);

    // 2. Get all active holds for this showtime
    const now = new Date();
    const holds = await SeatHold.find({
      showtimeId: id,
      expiresAt: { $gt: now }
    }).lean();

    const heldSeats = holds.map(hold => hold.seatId);

    // 3. Generate deterministic dummy seats based on showtime status
    let dummyBookedSeats: string[] = [];
    if (showtime && (showtime.status === "filling" || showtime.status === "almost-full")) {
      const allSeats = [];
      const rows = [
        { r: 'A', c: 14 }, { r: 'B', c: 16 }, { r: 'C', c: 18 },
        { r: 'D', c: 18 }, { r: 'E', c: 18 }, { r: 'F', c: 18 },
        { r: 'G', c: 20 }, { r: 'H', c: 20 }, { r: 'I', c: 20 },
        { r: 'J', c: 22 }
      ];
      
      for (const row of rows) {
        for (let i = 1; i <= row.c; i++) {
          allSeats.push(`${row.r}${i}`);
        }
      }

      // Initialize the seeded random generator
      const randomFunc = seededRandom(id);
      
      const fillPercentage = showtime.status === "almost-full" ? 0.85 : 0.50;
      
      for (const seat of allSeats) {
        // use the generator to get a value between 0 and 1
        const rand = (randomFunc() % 1000) / 1000;
        if (rand < fillPercentage) {
          dummyBookedSeats.push(seat);
        }
      }
    }

    // Combine real and dummy, filtering out duplicates just in case
    const bookedSeats = Array.from(new Set([...realBookedSeats, ...dummyBookedSeats]));

    return NextResponse.json({
      success: true,
      bookedSeats,
      heldSeats
    });

  } catch (error) {
    console.error("Error fetching seat status:", error);
    return NextResponse.json({ error: "Failed to fetch seat status" }, { status: 500 });
  }
}
