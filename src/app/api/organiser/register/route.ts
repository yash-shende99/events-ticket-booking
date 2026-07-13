import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      companyName: data.companyName,
      contactPhone: data.contactPhone,
      role: "organiser", // Securely assign organiser role
      verificationToken,
      isEmailVerified: false,
    });

    // Dummy email send for local dev
    console.log(`\n\n========================================`);
    console.log(`EMAIL VERIFICATION FOR ${data.email}`);
    console.log(`Click link to verify: http://localhost:3000/api/verify-email?token=${verificationToken}`);
    console.log(`========================================\n\n`);

    return NextResponse.json({ success: true, message: "Registered" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
