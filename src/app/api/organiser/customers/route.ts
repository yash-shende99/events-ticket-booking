import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { Ticket } from "@/models/Ticket";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "organiser") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find all movies owned by this organiser
    const movies = await Movie.find({ organiserId: session.user.id }).select('_id');
    const movieIds = movies.map(m => m._id);

    // 2. Fetch all confirmed tickets for these movies
    const tickets = await Ticket.find({ 
      movie: { $in: movieIds },
      status: "CONFIRMED"
    }).populate('user', 'name email image').lean();

    // 3. Aggregate customer data
    const customerMap = new Map();

    tickets.forEach((ticket: any) => {
      if (!ticket.user) return; // Skip if user was deleted
      const userId = ticket.user._id.toString();
      
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          _id: userId,
          name: ticket.user.name || "Unknown",
          email: ticket.user.email || "No Email",
          image: ticket.user.image || null,
          totalBookings: 0,
          totalTickets: 0,
          totalSpend: 0,
          lastBookingDate: ticket.createdAt
        });
      }

      const customer = customerMap.get(userId);
      customer.totalBookings += 1;
      customer.totalTickets += ticket.seats.length;
      customer.totalSpend += ticket.totalPrice;
      
      if (new Date(ticket.createdAt) > new Date(customer.lastBookingDate)) {
        customer.lastBookingDate = ticket.createdAt;
      }
    });

    // Convert map to array and sort by total spend (highest first)
    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);

    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("Failed to fetch organiser customers:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
