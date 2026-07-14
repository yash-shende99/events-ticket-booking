import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { AuditLog } from "@/models/AuditLog";
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
    
    // Fetch last 500 audit logs, populate admin name
    const logs = await AuditLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(500);

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Fetch Audit Logs Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
