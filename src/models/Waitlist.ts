import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema(
  {
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Optional, so guests can join waitlist with just email
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    seatsNeeded: {
      type: Number,
      required: true,
      default: 2,
    },
    category: {
      type: String,
      default: "Any",
    },
    status: {
      type: String,
      enum: ["waiting", "notified", "booked", "expired"],
      default: "waiting",
    },
    claimToken: {
      type: String,
    },
    claimExpiresAt: {
      type: Date,
    },
    offeredSeats: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Waitlist = mongoose.models?.Waitlist || mongoose.model("Waitlist", WaitlistSchema);
