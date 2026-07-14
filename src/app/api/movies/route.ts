import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find({}).sort({ _id: -1 }).lean();
    return NextResponse.json(movies);
  } catch (error: any) {
    console.error("Fetch Movies Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
