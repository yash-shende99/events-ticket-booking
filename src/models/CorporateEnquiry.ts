import mongoose, { Schema, Document } from "mongoose";

export interface ICorporateEnquiry extends Document {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  mobile: string;
  enquiryType: string;
  message?: string;
  status: "Pending" | "Resolved";
  createdAt: Date;
}

const CorporateEnquirySchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    enquiryType: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  { timestamps: true }
);

export const CorporateEnquiry = mongoose.models.CorporateEnquiry || mongoose.model<ICorporateEnquiry>("CorporateEnquiry", CorporateEnquirySchema);
