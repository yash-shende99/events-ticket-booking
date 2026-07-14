import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { Movie } from "@/models/Movie";
import { Showtime } from "@/models/Showtime";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ticketId, action } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    // Lookup the ticket by either _id or bookingId
    const ticket = await Ticket.findOne({
      $or: [{ _id: ticketId.length === 24 ? ticketId : null }, { bookingId: ticketId }]
    }).populate("user").populate("movie").populate({ path: "showtime", populate: { path: "theater" } });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Ensure the organiser owns the movie for this ticket
    if (ticket.movie.organiserId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Ticket does not belong to your events" }, { status: 403 });
    }

    if (action === "LOOKUP") {
      return NextResponse.json({ success: true, ticket });
    }

    if (action === "MARK_USED") {
      if (ticket.status !== "CONFIRMED") {
        return NextResponse.json({ error: `Cannot mark as used. Current status: ${ticket.status}` }, { status: 400 });
      }
      ticket.status = "USED";
      await ticket.save();
      return NextResponse.json({ success: true, ticket });
    }

    if (action === "MARK_CANCELLED") {
      ticket.status = "CANCELLED";
      await ticket.save();
      return NextResponse.json({ success: true, ticket });
    }

    if (action === "MARK_EXPIRED") {
      if (ticket.status !== "CONFIRMED") {
        return NextResponse.json({ error: `Cannot mark as expired. Current status: ${ticket.status}` }, { status: 400 });
      }
      ticket.status = "EXPIRED";
      await ticket.save();
      return NextResponse.json({ success: true, ticket });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Failed to validate ticket:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
