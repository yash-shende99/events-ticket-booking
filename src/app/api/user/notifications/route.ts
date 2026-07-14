import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { NotificationHistory } from "@/models/NotificationHistory";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user || user.accountStatus === "BANNED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.role; // "customer" or "organiser"
    
    // Build query to find notifications that apply to this user
    const audienceQueries = [{ audience: "ALL" }];
    
    if (role === "customer") {
      audienceQueries.push({ audience: "CUSTOMERS" });
    } else if (role === "organiser") {
      audienceQueries.push({ audience: "ORGANISERS" });
    }

    // If it's a PROMO, we only show it if the user has opted in
    // For now, let's just show GLOBAL and PROMO (if opted in)
    const typeQueries: any[] = [{ type: "GLOBAL" }];
    
    if (user.privacySettings?.marketing) {
      typeQueries.push({ type: "PROMO" });
    }

    // Note: Waitlist offers would normally be targeted to specific users via a different model,
    // but for this phase, we'll just show them to customers if audience matches.
    if (role === "customer") {
       typeQueries.push({ type: "WAITLIST" });
    }

    const notifications = await NotificationHistory.find({
      $and: [
        { $or: audienceQueries },
        { $or: typeQueries }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Fetch User Notifications Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
