import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import mongoose from "mongoose";

// Models need to be registered for population
import "@/models/Movie";
import "@/models/Event";

// Helper to get user
async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  await connectDB();
  return session.user.id;
}

// GET: Fetch wishlisted items
export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findById(userId)
      .populate("wishlistedMovies")
      .populate("wishlistedEvents")
      .lean();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ 
      movies: user.wishlistedMovies || [], 
      events: user.wishlistedEvents || [] 
    });
  } catch (error: any) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Toggle wishlist item
export async function POST(req: Request) {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId, type } = await req.json(); // type: 'MOVIE' | 'EVENT'
    if (!itemId || !type) {
      return NextResponse.json({ error: "Missing itemId or type" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const targetArray = type === 'MOVIE' ? 'wishlistedMovies' : 'wishlistedEvents';
    
    // Initialize if undefined
    if (!user[targetArray]) {
      user[targetArray] = [];
    }

    const itemObjectId = new mongoose.Types.ObjectId(itemId);
    const existingIndex = user[targetArray].findIndex((id: mongoose.Types.ObjectId) => id.toString() === itemId);

    let isWishlisted = false;

    if (existingIndex > -1) {
      // Remove it
      user[targetArray].splice(existingIndex, 1);
    } else {
      // Add it
      user[targetArray].push(itemObjectId);
      isWishlisted = true;
    }

    await user.save();

    return NextResponse.json({ success: true, isWishlisted });
  } catch (error: any) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
