import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Showtime } from "@/models/Showtime";
// Import models so mongoose registers them before population
import "@/models/Movie";
import "@/models/Theater";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }
    await connectDB();
    const showtime = await Showtime.findById(id).populate("movie").populate("theater");
    
    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }

    return NextResponse.json(showtime);
  } catch (error: any) {
    console.error("Error fetching showtime:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
