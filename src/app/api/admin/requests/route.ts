import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all listings that are either Pending Admin Approval, or recently Approved
    const requests = await Movie.find({ 
        status: { $in: ["Pending Admin Approval", "Approved"] } 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Fetch requests error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch requests" }, { status: 500 });
  }
}
