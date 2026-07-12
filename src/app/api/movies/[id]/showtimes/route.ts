import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Showtime } from "@/models/Showtime";
import "@/models/Theater"; // Ensure Theater model is registered for populate

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params;
    const url = new URL(req.url);
    const date = url.searchParams.get("date"); // optional date filter (YYYY-MM-DD)
    const format = url.searchParams.get("format"); 
    const language = url.searchParams.get("language"); 

    await connectDB();

    const query: any = { movie: movieId };
    if (date) query.date = date;
    if (format) query.format = format;
    if (language) query.language = language;

    const showtimes = await Showtime.find(query).populate("theater").sort({ time: 1 }).lean();

    return NextResponse.json(showtimes);
  } catch (error: any) {
    console.error("Error fetching movie showtimes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
