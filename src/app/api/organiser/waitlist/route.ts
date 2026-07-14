import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { Showtime } from "@/models/Showtime";
import { Waitlist } from "@/models/Waitlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find all movies owned by this organiser
    const movies = await Movie.find({ organiserId: session.user.id }).select('_id title');
    const movieIds = movies.map(m => m._id);

    // 2. Find all showtimes for these movies
    const showtimes = await Showtime.find({ movie: { $in: movieIds } }).select('_id date time screen theater format language');
    const showtimeIds = showtimes.map(s => s._id);

    // 3. Fetch all waitlist entries for these showtimes
    const waitlistEntries = await Waitlist.find({ showtimeId: { $in: showtimeIds } })
      .populate('userId', 'name email image')
      .populate({
        path: 'showtimeId',
        select: 'date time screen format language theater movie',
        populate: [
          { path: 'theater', select: 'name city' },
          { path: 'movie', select: 'title' }
        ]
      })
      .sort({ createdAt: 1 }) // First come, first served (oldest first)
      .lean();

    return NextResponse.json(waitlistEntries);
  } catch (error: any) {
    console.error("Failed to fetch organiser waitlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
