import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  admin: Types.ObjectId;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
