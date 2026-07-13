import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Theater } from "@/models/Theater";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const theaters = await Theater.find().sort({ name: 1 });
    return NextResponse.json(theaters);
  } catch (error: any) {
    console.error("Fetch Theaters Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
