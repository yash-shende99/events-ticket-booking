import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const requests = await Movie.find({ 
        status: { $in: ["Pending Admin Approval", "Approved"] } 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
