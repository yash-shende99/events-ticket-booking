import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { VenueRequest } from "@/models/VenueRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedRequest = await VenueRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
