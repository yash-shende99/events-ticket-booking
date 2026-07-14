import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { CorporateEnquiry } from "@/models/CorporateEnquiry";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const enquiry = await CorporateEnquiry.create({
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      email: data.email,
      mobile: data.mobile,
      enquiryType: data.enquiryType,
      message: data.message || "",
      status: "Pending",
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Create Corporate Enquiry Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit enquiry" }, { status: 500 });
  }
}
