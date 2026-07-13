import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISeatHold extends Document {
  showtimeId: Types.ObjectId;
  seatId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeatHoldSchema: Schema = new Schema(
  {
    showtimeId: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
    seatId: { type: String, required: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Concurrency protection: Enforce unique combination of showtime and seat for active holds
SeatHoldSchema.index({ showtimeId: 1, seatId: 1 }, { unique: true });

// TTL mechanism: Auto-delete the document when current time > expiresAt
SeatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

if (mongoose.models.SeatHold) delete mongoose.models.SeatHold;
export const SeatHold = mongoose.models.SeatHold || mongoose.model<ISeatHold>("SeatHold", SeatHoldSchema);
