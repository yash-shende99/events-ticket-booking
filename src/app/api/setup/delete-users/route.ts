import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const emails = [
      "yashshende9999@gmail.com",
      "dailyneeds@gmail.com",
      "yash.22310893@viit.ac.in",
      "hvdpvd@gmail.com"
    ];
    
    const result = await User.deleteMany({ email: { $in: emails } });
    
    return NextResponse.json({ message: `Deleted ${result.deletedCount} users.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
