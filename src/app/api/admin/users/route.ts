import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
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
    
    // Fetch all users except the admin who is currently logged in
    const users = await User.find({ email: { $ne: session.user.email } })
      .select("-password") // Never expose passwords
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { userId, accountStatus } = await req.json();

    if (!userId || !accountStatus) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["ACTIVE", "SUSPENDED", "BANNED"].includes(accountStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await User.updateOne({ _id: userId }, { $set: { accountStatus } });

    return NextResponse.json({ success: true, message: `User marked as ${accountStatus}` });
  } catch (error: any) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
