import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEventTicket extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  bookingId: string;
  tickets: {
    tier: string;
    count: number;
    price: number;
  }[];
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  createdAt: Date;
  updatedAt: Date;
}

const EventTicketSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    bookingId: { type: String, required: true, unique: true },
    tickets: [
      {
        tier: { type: String, required: true },
        count: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const EventTicket = mongoose.models.EventTicket || mongoose.model<IEventTicket>("EventTicket", EventTicketSchema);
