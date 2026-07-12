import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  title: string;
  subtitle: string;
  iconName: string;
  bgGradient: string;
  validity: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    iconName: { type: String, required: true },
    bgGradient: { type: String, required: true },
    validity: { type: String, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in development
export const Offer = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
