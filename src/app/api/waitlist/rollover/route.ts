import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Waitlist } from "@/models/Waitlist";
import { SeatHold } from "@/models/SeatHold";
import { Showtime } from "@/models/Showtime";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectDB();

    const now = new Date();

    // 1. Find all expired claims
    const expiredEntries = await Waitlist.find({
      status: "notified",
      claimExpiresAt: { $lt: now }
    });

    if (expiredEntries.length === 0) {
      return NextResponse.json({ message: "No expired waitlist claims to rollover." });
    }

    const processedCount = expiredEntries.length;

    for (const expiredEntry of expiredEntries) {
      // Mark as expired
      expiredEntry.status = "expired";
      await expiredEntry.save();

      // Ensure their holds are wiped out (they should naturally be expired, but we clean up)
      const holdUserId = expiredEntry.userId ? expiredEntry.userId.toString() : expiredEntry._id.toString();
      await SeatHold.deleteMany({
        userId: holdUserId,
        showtimeId: expiredEntry.showtimeId,
        seatId: { $in: expiredEntry.offeredSeats }
      });

      // The Handover: Let's find the next person in line for these seats
      // We look for someone who needs <= the offered seats length, matching category
      const nextWaitlistUser = await Waitlist.findOne({
        showtimeId: expiredEntry.showtimeId,
        status: "waiting",
        seatsNeeded: { $lte: expiredEntry.offeredSeats.length },
        $or: [{ category: expiredEntry.category }, { category: "Any" }]
      }).sort({ createdAt: 1 });

      if (nextWaitlistUser) {
        // Assign them the seats
        const assignedSeats = expiredEntry.offeredSeats.slice(0, nextWaitlistUser.seatsNeeded);
        
        const claimToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        nextWaitlistUser.status = "notified";
        nextWaitlistUser.claimToken = claimToken;
        nextWaitlistUser.claimExpiresAt = expiresAt;
        nextWaitlistUser.offeredSeats = assignedSeats;
        await nextWaitlistUser.save();

        // Place hold for new user
        const newHoldUserId = nextWaitlistUser.userId ? nextWaitlistUser.userId.toString() : nextWaitlistUser._id.toString();
        const holdDocs = assignedSeats.map((seatId: string) => ({
          showtimeId: expiredEntry.showtimeId,
          seatId: seatId,
          userId: newHoldUserId,
          expiresAt
        }));
        await SeatHold.insertMany(holdDocs);

        // Fetch showtime to get movie id for the link
        const showtime = await Showtime.findById(expiredEntry.showtimeId).lean();

        if (showtime) {
          const claimLink = `http://localhost:3000/movies/${showtime.movie}/addons/${showtime._id}?seats=${assignedSeats.join(",")}&claimToken=${claimToken}`;

          try {
            const transporter = nodemailer.createTransport({
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
              to: nextWaitlistUser.email,
              subject: `Good News! Waitlist Seats Rolled Over to You!`,
              html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center;">
                  <h2 style="color: #f84464;">It's Your Turn!</h2>
                  <p>Hi,</p>
                  <p>The previous person in the waitlist didn't claim their tickets in time. The following seats are now reserved for you:</p>
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Seats:</strong> ${assignedSeats.join(", ")}</p>
                  </div>
                  <p>You have 15 minutes to claim these seats.</p>
                  <a href="${claimLink}" style="display: inline-block; padding: 12px 24px; background: #f84464; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Claim Your Tickets</a>
                </div>
              `
            });
            console.log(`Rollover: Sent Waitlist Claim Email to ${nextWaitlistUser.email} for seats ${assignedSeats.join(",")}`);
          } catch (emailErr) {
            console.error("Failed to send waitlist rollover email:", emailErr);
          }
        }
      } else {
        console.log(`Rollover: No eligible next-in-line found for ${expiredEntry.showtimeId}`);
        // In a real system, the leftover seats go back to public pool, which happens naturally 
        // since we didn't renew the SeatHold.
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedCount,
      message: `Processed ${processedCount} expired claims.`
    });

  } catch (error: any) {
    console.error("Waitlist Rollover error:", error);
    return NextResponse.json({ error: "Failed to process waitlist rollover" }, { status: 500 });
  }
}
