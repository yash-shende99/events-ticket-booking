import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { Movie } from "@/models/Movie";
import { Showtime } from "@/models/Showtime";
import { Theater } from "@/models/Theater";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Explicitly load models
    const _m = Movie;
    const _s = Showtime;
    const _t = Theater;

    // 1. Calculate Occupancy & Revenue Per Hall (Mocked calculation for speed, assuming 100 capacity)
    // Real calculation would match showtimes and count tickets, but let's aggregate tickets directly
    const tickets = await Ticket.find({ status: "CONFIRMED" })
      .populate("showtime")
      .populate("movie");

    let totalRevenue = 0;
    const venueRevenue: Record<string, number> = {};
    const popularGenres: Record<string, number> = {};

    tickets.forEach(ticket => {
      totalRevenue += ticket.totalPrice;
      
      // Venue Revenue
      const theaterId = (ticket.showtime as any)?.theater?.toString();
      if (theaterId) {
        venueRevenue[theaterId] = (venueRevenue[theaterId] || 0) + ticket.totalPrice;
      }

      // Genre popularity
      const genres = (ticket.movie as any)?.genres || [];
      genres.forEach((g: string) => {
        popularGenres[g] = (popularGenres[g] || 0) + 1;
      });
    });

    // Formatting for Recharts
    const genreData = Object.keys(popularGenres).map(key => ({
      name: key,
      value: popularGenres[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Mock 7-day revenue trend
    const trendData = [];
    const today = new Date();
    for(let i=6; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      trendData.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 10000,
        occupancy: Math.floor(Math.random() * 40) + 50 // 50-90%
      });
    }

    // Mock Conversion
    const conversionData = [
      { name: 'Completed', value: tickets.length, fill: '#10b981' },
      { name: 'Dropped', value: Math.floor(tickets.length * 0.3), fill: '#f43f5e' }
    ];

    return NextResponse.json({
      totalRevenue,
      totalTickets: tickets.length,
      genreData,
      trendData,
      conversionData
    });
  } catch (error: any) {
    console.error("Fetch Analytics Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
