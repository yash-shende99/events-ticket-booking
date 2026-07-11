import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  rating: string;
  votes: string;
  formats: string[];
  languages: string[];
  duration: string;
  genres: string[];
  certification: string;
  releaseDate: string;
  poster: string;
  about: string;
  cast: { name: string; role: string; image: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    rating: { type: String, required: true },
    votes: { type: String, required: true },
    formats: { type: [String], required: true },
    languages: { type: [String], required: true },
    duration: { type: String, required: true },
    genres: { type: [String], required: true },
    certification: { type: String, required: true },
    releaseDate: { type: String, required: true },
    poster: { type: String, required: true },
    about: { type: String, required: true },
    cast: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String, required: true },
      },
    ]
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Movie) delete mongoose.models.Movie;
export const Movie = mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);
