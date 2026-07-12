import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, defaultLocation, marketingPreferences } = body;

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;
    if (defaultLocation) user.defaultLocation = defaultLocation;
    
    if (marketingPreferences !== undefined) {
      if (!user.privacySettings) {
        user.privacySettings = { marketing: true };
      }
      user.privacySettings.marketing = marketingPreferences;
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      user: {
        name: user.name,
        defaultLocation: user.defaultLocation,
        privacySettings: user.privacySettings
      } 
    });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
