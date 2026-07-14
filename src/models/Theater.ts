import mongoose from "mongoose";

const ScreenSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Audi 1"
  capacity: { type: Number, required: true },
  categories: [
    {
      name: { type: String, required: true }, // e.g., "Premium", "Standard"
      priceMultiplier: { type: Number, default: 1 } // For future pricing logic
    }
  ],
  layout: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  }
});

const TheaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: "Unknown City"
    },
    address: {
      type: String,
      required: true,
      default: "Unknown Address"
    },
    amenities: {
      type: [String],
      default: [],
    },
    screens: {
      type: [ScreenSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Theater = mongoose.models?.Theater || mongoose.model("Theater", TheaterSchema);
