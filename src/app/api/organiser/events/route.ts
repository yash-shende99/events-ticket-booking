import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    const newEvent = await Movie.create({
      ...data,
      organiserId: session.user.id,
      // Fallbacks if some arrays are missing from the request
      formats: data.formats || [],
      languages: data.languages || [],
      genres: data.genres || [],
      cast: data.cast || [],
      gallery: data.gallery || [],
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error: any) {
    console.error("Event Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const events = await Movie.find({ organiserId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Fetch Events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
