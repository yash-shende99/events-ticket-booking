import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITicket extends Document {
  user: Types.ObjectId;
  movie: Types.ObjectId;
  showtime: Types.ObjectId;
  bookingId: string;
  seats: string[];
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    showtime: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
    bookingId: { type: String, required: true, unique: true },
    seats: { type: [String], required: true },
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

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
