import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string; // 'Customer', 'Organiser', 'Admin'
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, enum: ['Customer', 'Organiser', 'Admin'] },
    permissions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Role) {
  delete mongoose.models.Role;
}
export const Role = mongoose.model<IRole>("Role", RoleSchema);
