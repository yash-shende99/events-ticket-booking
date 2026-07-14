import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { User } from "@/models/User";
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
    
    // Explicitly load models
    const _u = User;
    const _m = Movie;

    const pendingRefunds = await Ticket.find({ status: "CANCELLED", refundStatus: "PENDING" })
      .populate("user", "name email")
      .populate("movie", "title")
      .sort({ updatedAt: -1 });

    return NextResponse.json(pendingRefunds);
  } catch (error: any) {
    console.error("Fetch Refunds Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    console.log("[Refund API] Request body:", body);
    const { ticketId } = body;

    const ticket = await Ticket.findById(ticketId);
    console.log("[Refund API] Found ticket:", ticket);
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    
    console.log("[Refund API] Ticket status:", ticket.status, "Refund status:", ticket.refundStatus);
    const dbRefundStatus = ticket.get("refundStatus") || ticket.refundStatus;
    
    if (ticket.status !== "CANCELLED" || dbRefundStatus !== "PENDING") {
      return NextResponse.json({ error: `Refund is not pending.` }, { status: 400 });
    }

    // In reality, this is where you'd call Razorpay/Stripe API to issue refund
    // const razorpay = new Razorpay(...)
    // await razorpay.payments.refund(...)

    await Ticket.updateOne({ _id: ticketId }, { $set: { refundStatus: "PROCESSED" } });

    return NextResponse.json({ success: true, message: "Refund processed successfully" });
  } catch (error: any) {
    console.error("Process Refund Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
