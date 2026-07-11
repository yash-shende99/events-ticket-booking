import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  posterImage: string;
  backdropImage?: string;
  duration: number; // in minutes
  releaseDate: Date;
  genre: string[];
  language: string[];
  cast: { name: string; role: string; image?: string }[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    posterImage: { type: String, required: true },
    backdropImage: { type: String },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: [String], required: true },
    language: { type: [String], required: true },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String },
      },
    ],
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);
