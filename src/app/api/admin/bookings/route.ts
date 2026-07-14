import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { User } from "@/models/User";
import { Movie } from "@/models/Movie";
import { Showtime } from "@/models/Showtime";
import { Theater } from "@/models/Theater";
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
    const _u = User;
    const _m = Movie;
    const _s = Showtime;
    const _t = Theater;

    const tickets = await Ticket.find()
      .populate("user", "name email")
      .populate("movie", "title poster")
      .populate({
        path: "showtime",
        populate: {
          path: "theater",
          model: "Theater",
          select: "name city"
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error("Fetch Admin Bookings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
