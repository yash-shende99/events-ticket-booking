import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper to authenticate request
async function getAuthUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(auth.id).select("-password -verificationToken -resetPasswordToken");
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, currentPassword, newPassword, profilePicture } = await req.json();
    
    await connectToDatabase();
    const user = await User.findById(auth.id);
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update name if provided
    if (name) user.name = name;

    // Update profile picture if provided
    if (profilePicture) user.profilePicture = profilePicture;

    // Password change logic
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password || "");
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }
      
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
