import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { RefreshToken } from "@/models/RefreshToken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      await connectToDatabase();
      // Remove from DB to revoke access
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
