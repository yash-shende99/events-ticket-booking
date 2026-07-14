import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { Showtime } from "@/models/Showtime";
import { Theater } from "@/models/Theater"; // Ensure Theater model is registered
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
    const movies = await Movie.find({ organiserId: session.user.id }).select('_id');
    const movieIds = movies.map(m => m._id);

    // 2. Fetch all showtimes for these movies
    const showtimes = await Showtime.find({ movie: { $in: movieIds } })
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city')
      .sort({ date: -1, time: -1 })
      .lean();

    return NextResponse.json(showtimes);
  } catch (error: any) {
    console.error("Failed to fetch organiser showtimes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
