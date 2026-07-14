import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json({
        movies: movies.map(m => ({ title: m.title, status: m.status, eventType: m.eventType }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
