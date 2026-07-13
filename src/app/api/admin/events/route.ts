import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
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
    // Fetch all events, prioritizing ones that need scheduling
    const events = await Movie.find().sort({ createdAt: -1 });

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Admin Fetch Events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
