import mongoose from "mongoose";

const ShowtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    date: {
      type: String, // format: "YYYY-MM-DD"
      required: true,
    },
    time: {
      type: String, // format: "HH:MM A" e.g., "09:25 PM"
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    type: {
      type: String, // e.g. "Cancellation available", "2K LASER"
    },
    status: {
      type: String,
      enum: ["available", "filling", "almost-full"],
      default: "available",
    },
    isLate: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const Showtime = mongoose.models?.Showtime || mongoose.model("Showtime", ShowtimeSchema);
