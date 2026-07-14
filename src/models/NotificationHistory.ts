import mongoose, { Schema, Document } from "mongoose";

export interface INotificationHistory extends Document {
  type: "GLOBAL" | "PROMO" | "WAITLIST";
  audience: "ALL" | "CUSTOMERS" | "ORGANISERS";
  subject: string;
  message: string;
  recipientCount: number;
  sentBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationHistorySchema: Schema = new Schema(
  {
    type: { type: String, required: true },
    audience: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    recipientCount: { type: Number, default: 0 },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const NotificationHistory = mongoose.models.NotificationHistory || mongoose.model<INotificationHistory>("NotificationHistory", NotificationHistorySchema);
