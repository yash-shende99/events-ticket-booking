import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const newMovie = await Movie.create({
      ...data,
      organiserId: session.user.id,
    });

    return NextResponse.json({ success: true, movie: newMovie }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create movie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
