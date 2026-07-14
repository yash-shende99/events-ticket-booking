import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { CorporateEnquiry } from "@/models/CorporateEnquiry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const enquiries = await CorporateEnquiry.find().sort({ createdAt: -1 });

    return NextResponse.json(enquiries);
  } catch (error: any) {
    console.error("Fetch Corporate Enquiries Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch enquiries" }, { status: 500 });
  }
}
