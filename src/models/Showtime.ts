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
      required: false, // Optional for Events
    },
    isEvent: { type: Boolean, default: false },
    eventLocation: { type: String },
    screen: {
      type: String, // e.g., "Hall 1", "Main Stage"
      default: "Screen 1"
    },
    capacity: {
      type: Number,
      default: 100
    },
    pricing: {
      premium: { type: Number, default: 500 },
      standard: { type: Number, default: 300 },
      economy: { type: Number, default: 150 },
      platinum: { type: Number, default: 800 },
      gold: { type: Number, default: 600 },
      silver: { type: Number, default: 400 },
      recliner: { type: Number, default: 1000 }
    },
    dynamicPricing: {
      isWeekendPricing: { type: Boolean, default: false },
      isFestivalPricing: { type: Boolean, default: false },
      isEarlyBirdActive: { type: Boolean, default: false },
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
      enum: ["available", "filling", "almost-full", "sold-out"],
      default: "available",
    },
    isLate: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

if (mongoose.models.Showtime) {
  delete mongoose.models.Showtime;
}
export const Showtime = mongoose.model("Showtime", ShowtimeSchema);
