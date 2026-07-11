import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { RefreshToken } from "@/models/RefreshToken";
import { generateAccessToken, verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Verify token exists in DB and isn't revoked
    const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenInDb) {
      return NextResponse.json({ error: "Refresh token has been revoked" }, { status: 401 });
    }

    const payload = { id: decoded.id, role: decoded.role, email: decoded.email };
    const newAccessToken = generateAccessToken(payload);

    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60 // 15 mins
    });

    return NextResponse.json({ message: "Token refreshed successfully" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
