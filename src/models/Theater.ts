import mongoose from "mongoose";

const TheaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Theater = mongoose.models?.Theater || mongoose.model("Theater", TheaterSchema);
