import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Waitlist } from "@/models/Waitlist";
import { Showtime } from "@/models/Showtime";
import { Movie } from "@/models/Movie";
import { Theater } from "@/models/Theater";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Explicitly load models
    const _s = Showtime;
    const _m = Movie;
    const _t = Theater;
    const _u = User;

    // Fetch all waitlists and populate showtime info
    const waitlists = await Waitlist.find({ status: "waiting" })
      .populate({
        path: "showtimeId",
        populate: [
          { path: "movie", select: "title poster" },
          { path: "theater", select: "name city" }
        ]
      })
      .sort({ createdAt: 1 }); // Oldest first (queue order)

    return NextResponse.json(waitlists);
  } catch (error: any) {
    console.error("Fetch Admin Waitlists Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
