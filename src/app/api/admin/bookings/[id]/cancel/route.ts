import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status === "CANCELLED") {
      return NextResponse.json({ error: "Ticket is already cancelled" }, { status: 400 });
    }

    // Admin cancellation cancels everything
    ticket.status = "CANCELLED";
    ticket.refundStatus = "PENDING";

    await ticket.save();

    return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error: any) {
    console.error("Admin Cancel Booking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
