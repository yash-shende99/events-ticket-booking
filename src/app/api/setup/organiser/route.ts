import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const email = "admin@cineverse.com";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "organiser";
      await existingUser.save();
      return NextResponse.json({ message: "Updated existing admin to organiser role" });
    } else {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Super Organiser",
        email,
        password: hashedPassword,
        role: "organiser",
        isEmailVerified: true
      });
      return NextResponse.json({ message: "Created new admin@cineverse.com organiser account" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
