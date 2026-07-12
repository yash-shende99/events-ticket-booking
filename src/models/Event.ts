import mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
  title: string;
  category: string;
  languages: string[];
  price: string;
  poster: string;
  date: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g. Comedy, Music, Workshop
    languages: { type: [String], required: true },
    price: { type: String, required: true },
    poster: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
