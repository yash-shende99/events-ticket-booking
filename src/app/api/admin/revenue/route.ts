import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
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

    // Aggregate confirmed tickets to get total revenue
    // In a real app, you might group by day/week/month or by event
    const aggregationResult = await Ticket.aggregate([
      { $match: { status: "CONFIRMED" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } }
    ]);

    // Calculate total refunds processed
    const refundResult = await Ticket.aggregate([
      { $match: { status: "CANCELLED", refundStatus: "PROCESSED" } },
      { $group: { _id: null, totalRefunds: { $sum: "$totalPrice" } } }
    ]);

    const grossRevenue = aggregationResult.length > 0 ? aggregationResult[0].totalRevenue : 0;
    const totalTicketsSold = aggregationResult.length > 0 ? aggregationResult[0].count : 0;
    const totalRefunds = refundResult.length > 0 ? refundResult[0].totalRefunds : 0;

    // Fixed platform fee (e.g., 10%)
    const PLATFORM_FEE_PERCENTAGE = 0.10;
    const platformFee = grossRevenue * PLATFORM_FEE_PERCENTAGE;
    const organizerShare = grossRevenue - platformFee;

    // Fetch recent transactions (last 10 confirmed tickets)
    const recentTransactions = await Ticket.find({ status: "CONFIRMED" })
      .populate("user", "name email")
      .populate("movie", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      grossRevenue,
      platformFee,
      organizerShare,
      totalTicketsSold,
      totalRefunds,
      recentTransactions
    });

  } catch (error: any) {
    console.error("Fetch Admin Revenue Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
