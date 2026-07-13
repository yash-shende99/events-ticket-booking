import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak whether user exists or not for security
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    console.log(`\n\n========================================`);
    console.log(`PASSWORD RESET FOR ${email}`);
    console.log(`Click link to reset: http://localhost:3000/reset-password?token=${resetToken}`);
    console.log(`========================================\n\n`);

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
