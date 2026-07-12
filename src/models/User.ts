import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role?: string;
  roleId?: mongoose.Types.ObjectId;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  profilePicture?: string; // base64 or URL
  defaultLocation?: string;
  privacySettings?: { marketing: boolean };
  wishlistedMovies: mongoose.Types.ObjectId[];
  wishlistedEvents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if we support OAuth later
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    profilePicture: { type: String },
    defaultLocation: { type: String, default: "Pune" },
    privacySettings: { 
      marketing: { type: Boolean, default: true }
    },
    wishlistedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    wishlistedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  {
    timestamps: true,
  }
);

// Prevent Mongoose from caching the old schema during Next.js hot-reloads
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser>("User", UserSchema);
