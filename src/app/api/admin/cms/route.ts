import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { CMS } from "@/models/CMS";
import { Movie } from "@/models/Movie";
import { AuditLog } from "@/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    // Fetch the single CMS document (create if doesn't exist)
    let cms = await CMS.findOne().populate("featuredMovies", "title bannerImage").populate("trendingMovies", "title posterImage");
    
    if (!cms) {
      cms = await CMS.create({ homepageBanners: [], featuredMovies: [], promotions: [], trendingMovies: [] });
    }

    return NextResponse.json(cms);
  } catch (error: any) {
    console.error("Fetch CMS Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    let cms = await CMS.findOne();
    if (!cms) {
      cms = new CMS(data);
    } else {
      if (data.homepageBanners !== undefined) cms.homepageBanners = data.homepageBanners;
      if (data.featuredMovies !== undefined) cms.featuredMovies = data.featuredMovies;
      if (data.promotions !== undefined) cms.promotions = data.promotions;
      if (data.trendingMovies !== undefined) cms.trendingMovies = data.trendingMovies;
    }

    await cms.save();

    // Log the action
    await AuditLog.create({
      admin: session.user.id,
      action: "UPDATED_CMS",
      details: `Updated Content Management settings.`,
    });

    return NextResponse.json({ success: true, message: "CMS settings updated" });
  } catch (error: any) {
    console.error("Update CMS Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
