import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  title: string;
  subtitle: string;
  iconName: string;
  bgGradient: string;
  validity: string;
  category: string;
  code?: string;
  discountPercentage?: number;
  maxDiscount?: number;
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
    code: { type: String, unique: true, sparse: true },
    discountPercentage: { type: Number },
    maxDiscount: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in development
// Delete the cached model to ensure schema updates take effect in Next.js hot reload
if (mongoose.models.Offer) {
  delete mongoose.models.Offer;
}

export const Offer = mongoose.model<IOffer>("Offer", OfferSchema);
