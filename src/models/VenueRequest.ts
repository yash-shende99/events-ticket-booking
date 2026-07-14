import mongoose, { Schema, Document } from "mongoose";

export interface IVenueRequest extends Document {
  organiserId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  venueId: mongoose.Types.ObjectId;
  screenId: string;
  startDate: Date;
  endDate: Date;
  capacityRequested: number;
  message?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const VenueRequestSchema: Schema = new Schema(
  {
    organiserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    venueId: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
    screenId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacityRequested: { type: Number, required: true },
    message: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export const VenueRequest = mongoose.models.VenueRequest || mongoose.model<IVenueRequest>("VenueRequest", VenueRequestSchema);
