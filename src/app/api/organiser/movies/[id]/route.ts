import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await Movie.findById(id).lean();
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (movie.organiserId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You don't own this event" }, { status: 403 });
    }

    return NextResponse.json(movie);
  } catch (error: any) {
    console.error("Failed to fetch movie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (movie.organiserId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You don't own this event" }, { status: 403 });
    }

    const data = await req.json();

    // Prevent organiserId from being overwritten
    delete data.organiserId;

    const updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, movie: updatedMovie });
  } catch (error: any) {
    console.error("Failed to update movie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (movie.organiserId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You don't own this event" }, { status: 403 });
    }

    await Movie.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Movie deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete movie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
