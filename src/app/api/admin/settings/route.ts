import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SystemConfig } from "@/models/SystemConfig";
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
    
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Fetch Config Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig({ ...data, updatedBy: session.user.id });
    } else {
      Object.assign(config, data);
      config.updatedBy = session.user.id;
    }

    await config.save();

    await AuditLog.create({
      admin: session.user.id,
      action: "UPDATED_SYSTEM_CONFIG",
      details: `Modified global platform variables.`,
    });

    return NextResponse.json({ success: true, message: "System configuration saved successfully!" });
  } catch (error: any) {
    console.error("Update Config Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
