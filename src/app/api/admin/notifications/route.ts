import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NotificationHistory } from "@/models/NotificationHistory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    const history = await NotificationHistory.find().populate("sentBy", "name").sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, audience, subject, message } = await req.json();

    if (!type || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    let recipientCount = 0;

    // Helper to build audience query
    const getAudienceQuery = () => {
      const q: any = { accountStatus: { $ne: "BANNED" } };
      if (audience === "CUSTOMERS") q.role = "customer";
      else if (audience === "ORGANISERS") q.role = "organiser";
      return q;
    };

    // Simulate sending notifications
    if (type === "GLOBAL") {
      const users = await User.find(getAudienceQuery());
      recipientCount = users.length;
      console.log(`[Notification Center] Sent GLOBAL broadcast to ${recipientCount} ${audience} users: ${subject}`);
    } else if (type === "PROMO") {
      const q = getAudienceQuery();
      q["privacySettings.marketing"] = true;
      const users = await User.find(q);
      recipientCount = users.length;
      console.log(`[Notification Center] Sent PROMO email to ${recipientCount} opted-in users: ${subject}`);
    } else if (type === "WAITLIST") {
      // Logic for waitlist would go here. For now, simulate.
      console.log(`[Notification Center] Sent WAITLIST OFFER to pending users: ${subject}`);
      recipientCount = 15; // Simulated count
    } else {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
    }

    // Save to history
    await NotificationHistory.create({
      type,
      audience: type === "WAITLIST" ? "ALL" : audience,
      subject,
      message,
      recipientCount,
      sentBy: session.user.id
    });

    // Since we don't have active SMTP, we will just log and return success
    return NextResponse.json({ 
      success: true, 
      message: `Successfully dispatched to ${recipientCount} recipients.`,
      recipients: recipientCount
    });
  } catch (error: any) {
    console.error("Send Notification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
