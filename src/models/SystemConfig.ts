import mongoose, { Schema, Document } from "mongoose";

export interface ISystemConfig extends Document {
  seatHoldTTL: number; // in minutes
  waitlistExpiry: number; // in minutes
  bookingCancellationWindow: number; // in hours before showtime
  platformFeePercentage: number; // e.g. 10 for 10%
  taxRatePercentage: number; // e.g. 18 for 18%
  qrExpiryHours: number;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema: Schema = new Schema(
  {
    seatHoldTTL: { type: Number, default: 10 },
    waitlistExpiry: { type: Number, default: 30 },
    bookingCancellationWindow: { type: Number, default: 4 },
    platformFeePercentage: { type: Number, default: 10 },
    taxRatePercentage: { type: Number, default: 18 },
    qrExpiryHours: { type: Number, default: 24 },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

export const SystemConfig = mongoose.models.SystemConfig || mongoose.model<ISystemConfig>("SystemConfig", SystemConfigSchema);
