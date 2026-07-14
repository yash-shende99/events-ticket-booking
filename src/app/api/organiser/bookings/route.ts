import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { Ticket } from "@/models/Ticket";
import { Showtime } from "@/models/Showtime";
import { User } from "@/models/User";
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

    // 2. Fetch all tickets for these movies
    const bookings = await Ticket.find({ movie: { $in: movieIds } })
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate({
        path: 'showtime',
        select: 'date time screen format language theater',
        populate: { path: 'theater', select: 'name city' }
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Failed to fetch organiser bookings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
