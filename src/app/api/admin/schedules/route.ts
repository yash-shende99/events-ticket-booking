import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Showtime } from "@/models/Showtime";
import { Movie } from "@/models/Movie";
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
    
    // Explicitly load models to ensure populate works
    const m = Movie;
    const t = Theater;

    const showtimes = await Showtime.find()
      .populate("movie", "title poster duration")
      .populate("theater", "name city")
      .sort({ date: 1, time: 1 });

    return NextResponse.json(showtimes);
  } catch (error: any) {
    console.error("Fetch Admin Schedules Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
