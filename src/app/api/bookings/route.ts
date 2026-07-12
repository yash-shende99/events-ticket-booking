import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "000000000000000000000000";

    const body = await req.json();
    const { movieId, showtimeId, seats, time, totalPrice, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!movieId || !seats || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields or payment details" }, { status: 400 });
    }

    // Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    await connectDB();

    // In a real app we'd verify seat availability and concurrency here.
    // We'll skip complex concurrency since this is mock logic for the assignment, 
    // but we will create the ticket.

    const bookingRef = `BK${Math.floor(10000 + Math.random() * 90000)}`;
    const parsedSeats = Array.from({ length: parseInt(seats) }, (_, i) => `Seat ${i + 1}`);

    // Fetch user for email (if exists, else fallback)
    const user = await User.findById(userId);

    const ticket = await Ticket.create({
      user: userId,
      movie: new mongoose.Types.ObjectId(movieId.length === 24 ? movieId : "000000000000000000000000"), // fallback for mock
      showtime: new mongoose.Types.ObjectId(showtimeId.length === 24 ? showtimeId : "000000000000000000000000"),
      bookingId: bookingRef,
      seats: parsedSeats,
      totalPrice: totalPrice,
      status: "CONFIRMED"
    });

    // 1. Generate QR Code
    const qrPayload = JSON.stringify({ bookingId: bookingRef, ticketId: ticket._id });
    const qrDataUrl = await QRCode.toDataURL(qrPayload);

    // 2. Setup Real SMTP Email Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Send Email (Async to prevent blocking response)
    transporter.sendMail({
      from: `"BookMyShow Clone" <${process.env.SMTP_USER}>`,
      to: user?.email && user.email.includes("@") ? user.email : process.env.SMTP_USER,
      subject: `Your Booking is Confirmed! [${bookingRef}]`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #f84464;">Booking Confirmed!</h2>
          <p>Hi ${user?.name || "Movie Buff"},</p>
          <p>Your tickets have been successfully booked. Please find your QR code ticket below.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${bookingRef}</p>
            <p><strong>Seats:</strong> ${parsedSeats.join(", ")}</p>
            <p><strong>Amount Paid:</strong> ₹${totalPrice}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <img src="cid:qrcode" alt="QR Ticket" style="width: 200px; height: 200px;" />
            <p style="font-size: 12px; color: #666;">Scan this QR code at the cinema entrance.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'ticket-qr.png',
          path: qrDataUrl,
          cid: 'qrcode' // same cid value as in the html img src
        }
      ]
    }).then(() => {
      console.log("Real Email sent successfully to %s", user?.email || "customer");
    }).catch((err) => {
      console.error("Failed to send background email:", err);
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: bookingRef
    });

  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
