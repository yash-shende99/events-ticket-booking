import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Role } from "@/models/Role";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, roleName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Default to 'Customer' role if none provided
    const targetRoleName = roleName || "Customer";
    let role = await Role.findOne({ name: targetRoleName });
    
    // Seed role if it doesn't exist
    if (!role) {
      role = await Role.create({ name: targetRoleName, permissions: [] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: role._id,
      isEmailVerified: true, // Auto-verify
      verificationToken: undefined,
    });

    // Verification email disabled per request
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ 
      message: "Registration successful. You can now log in." 
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
