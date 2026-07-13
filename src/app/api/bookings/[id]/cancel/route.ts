import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { Waitlist } from "@/models/Waitlist";
import { User } from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json().catch(() => ({}));
    const { seatsToCancel } = body;

    // Find the ticket and make sure it belongs to the user
    const ticket = await Ticket.findOne({ _id: id, user: session.user.id });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status === "CANCELLED") {
      return NextResponse.json({ error: "Ticket is already cancelled" }, { status: 400 });
    }

    let cancelledSeats = [];
    if (!seatsToCancel || !Array.isArray(seatsToCancel) || seatsToCancel.length === 0) {
      // Cancel everything
      cancelledSeats = [...ticket.seats];
      ticket.status = "CANCELLED";
    } else {
      // Partial cancellation
      cancelledSeats = seatsToCancel.filter((s: string) => ticket.seats.includes(s));
      
      if (cancelledSeats.length === 0) {
        return NextResponse.json({ error: "None of the specified seats are on this ticket." }, { status: 400 });
      }

      // Remove the cancelled seats from the ticket
      ticket.seats = ticket.seats.filter((s: string) => !cancelledSeats.includes(s));
      
      // If they cancelled all the seats manually, mark ticket as CANCELLED
      if (ticket.seats.length === 0) {
        ticket.status = "CANCELLED";
      }
    }

    await ticket.save();
    const showtimeId = ticket.showtime;

    // Helper to determine category of a seat (e.g. A1 -> Recliner, C4 -> Classic Plus)
    const getSeatCategory = (seatId: string) => {
      const row = seatId.charAt(0).toUpperCase();
      if (row === 'A') return "Recliner";
      if (['B','C','D','E','F'].includes(row)) return "Classic Plus";
      if (['G','H','I','J'].includes(row)) return "Classic";
      return "Any"; // Fallback
    };

    // We process each cancelled seat. Waitlists might want multiple seats.
    // For simplicity, we assume waitlist users want seats of the SAME category.
    // Let's group cancelled seats by category.
    const seatsByCategory: Record<string, string[]> = {};
    for (const seat of cancelledSeats) {
      const cat = getSeatCategory(seat);
      if (!seatsByCategory[cat]) seatsByCategory[cat] = [];
      seatsByCategory[cat].push(seat);
    }

    for (const [category, availableSeats] of Object.entries(seatsByCategory)) {
      let remainingSeats = [...availableSeats];

      // Keep finding waitlist users until no seats are left in this category
      while (remainingSeats.length > 0) {
        // Find the oldest waitlist user who needs <= remainingSeats.length
        // and whose category preference matches this category OR is "Any"
        const waitlistUser = await Waitlist.findOne({
          showtimeId,
          status: "waiting",
          seatsNeeded: { $lte: remainingSeats.length },
          $or: [{ category: category }, { category: "Any" }]
        }).sort({ createdAt: 1 }); // Oldest first (queue)

        if (!waitlistUser) {
          // No more waitlist users can be satisfied with the remaining seats
          break;
        }

        const claimToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Instead of auto-booking a free ticket, we will generate a claim link and email them!
        waitlistUser.status = "notified";
        waitlistUser.claimToken = claimToken;
        waitlistUser.claimExpiresAt = expiresAt;
        waitlistUser.offeredSeats = assignedSeats;
        await waitlistUser.save();
        
        // Hold the seats for the waitlist user for 15 minutes
        // We'll use the waitlist entry ID as the pseudo-userId for the hold so they can claim it
        // Or if they have a real userId, use that.
        const holdUserId = waitlistUser.userId ? waitlistUser.userId.toString() : waitlistUser._id.toString();
        
        const holdDocs = assignedSeats.map(seatId => ({
          showtimeId: showtimeId,
          seatId: seatId,
          userId: holdUserId,
          expiresAt
        }));
        
        try {
          const { SeatHold } = require("@/models/SeatHold");
          await SeatHold.insertMany(holdDocs);
        } catch (holdErr) {
          console.error("Failed to hold seats for waitlist user:", holdErr);
        }

        const claimLink = `http://localhost:3000/movies/${ticket.movie}/addons/${showtimeId}?seats=${assignedSeats.join(",")}&claimToken=${claimToken}`;

        try {
          // Send Email to the waitlist user
          const transporter = require("nodemailer").createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false, 
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"BookMyShow Clone" <${process.env.SMTP_USER}>`,
            to: waitlistUser.email,
            subject: `Good News! Waitlist Seats Available for ${assignedSeats.length} ticket(s)`,
            html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center;">
                <h2 style="color: #f84464;">Seats Just Opened Up!</h2>
                <p>Hi,</p>
                <p>Someone just cancelled their booking. The following seats matching your waitlist request are now reserved for you temporarily:</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Seats:</strong> ${assignedSeats.join(", ")}</p>
                </div>
                <p>You have 15 minutes to claim these seats before they are released to the general public or the next person in the queue.</p>
                <a href="${claimLink}" style="display: inline-block; padding: 12px 24px; background: #f84464; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Claim Your Tickets</a>
              </div>
            `
          });
          console.log(`Sent Waitlist Claim Email to ${waitlistUser.email} for seats ${assignedSeats.join(",")}`);
        } catch (emailErr) {
          console.error("Failed to send waitlist claim email:", emailErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cancellation error:", err);
    return NextResponse.json({ error: "Failed to cancel ticket" }, { status: 500 });
  }
}
