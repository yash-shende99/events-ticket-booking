import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICMS extends Document {
  homepageBanners: string[];
  featuredMovies: Types.ObjectId[];
  promotions: string[];
  trendingMovies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CMSSchema: Schema = new Schema(
  {
    homepageBanners: { type: [String], default: [] },
    featuredMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    promotions: { type: [String], default: [] },
    trendingMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }]
  },
  {
    timestamps: true,
  }
);

export const CMS = mongoose.models.CMS || mongoose.model<ICMS>("CMS", CMSSchema);
