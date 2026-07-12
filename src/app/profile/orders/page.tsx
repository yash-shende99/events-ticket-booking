import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { Ticket } from "@/models/Ticket";
import { EventTicket } from "@/models/EventTicket";
import { Calendar, MapPin, ChevronRight, Ticket as TicketIcon } from "lucide-react";

// Ensure all schemas are registered
import "@/models/Movie";
import "@/models/Showtime";
import "@/models/Theater";
import "@/models/Event";
import "@/models/User";

type UnifiedOrder = {
  _id: string;
  type: "MOVIE" | "EVENT";
  bookingId: string;
  title: string;
  subtitle: string;
  poster: string;
  date: string;
  location: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
  seatsOrTickets: string;
  ticketLink: string;
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  // Fetch Movie Tickets
  const movieTickets = await Ticket.find({ user: session.user.id })
    .populate({
      path: "showtime",
      populate: [{ path: "movie" }, { path: "theater" }],
    })
    .lean();

  // Fetch Event Tickets
  const eventTickets = await EventTicket.find({ user: session.user.id })
    .populate("event")
    .lean();

  const orders: UnifiedOrder[] = [];

  // Transform Movie Tickets
  for (const t of movieTickets as any[]) {
    const movie = t.showtime?.movie;
    const theater = t.showtime?.theater;
    const st = t.showtime;

    orders.push({
      _id: t._id.toString(),
      type: "MOVIE",
      bookingId: t.bookingId,
      title: movie?.title || "Movie Ticket",
      subtitle: `${st?.language || ""} • ${st?.format || ""}`,
      poster: movie?.poster || "/placeholder-movie.jpg",
      date: `${st?.date || ""} | ${st?.time || ""}`,
      location: theater?.name || "Cinema",
      totalPrice: t.totalPrice,
      status: t.status,
      createdAt: new Date(t.createdAt),
      seatsOrTickets: t.seats ? t.seats.join(", ") : "N/A",
      ticketLink: `/movies/${movie?._id}/booking-success/${t.bookingId}`,
    });
  }

  // Transform Event Tickets
  for (const t of eventTickets as any[]) {
    const event = t.event;
    const ticketSummary = t.tickets ? t.tickets.map((tk: any) => `${tk.count}x ${tk.tier}`).join(", ") : "Tickets";

    orders.push({
      _id: t._id.toString(),
      type: "EVENT",
      bookingId: t.bookingId,
      title: event?.title || "Event Ticket",
      subtitle: `${event?.category || ""} • ${event?.languages?.join(", ") || ""}`,
      poster: event?.poster || "/placeholder-event.jpg",
      date: `${event?.date || ""} | 05:30 PM`, // Events currently use hardcoded time in schema
      location: event?.location || "Event Venue",
      totalPrice: t.totalPrice,
      status: t.status,
      createdAt: new Date(t.createdAt),
      seatsOrTickets: ticketSummary,
      ticketLink: `/events/${event?._id}/booking-success/${t.bookingId}`,
    });
  }

  // Sort by newest first
  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <TicketIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Looks like you haven't booked any movies or events yet.
            </p>
            <Link href="/">
              <button className="bg-[#f84464] hover:bg-[#e03c5a] text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Browse Experiences
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-md"
              >
                {/* Poster image (hidden on tiny screens) */}
                <div className="hidden sm:block w-32 md:w-48 shrink-0 bg-gray-100 relative">
                  {order.poster && (
                    <Image 
                      src={order.poster.startsWith('http') ? order.poster : order.poster.startsWith('//') ? `https:${order.poster}` : `/${order.poster.startsWith('/') ? order.poster.substring(1) : order.poster}`}
                      alt={order.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded tracking-wider uppercase ${
                        order.type === 'MOVIE' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {order.type}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        Booked on {order.createdAt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{order.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{order.subtitle}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span>{order.date}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span>{order.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Booking ID</p>
                      <p className="font-mono font-bold text-gray-900">{order.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Tickets</p>
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={order.seatsOrTickets}>
                        {order.seatsOrTickets}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Amount</p>
                      <p className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Right Action Panel */}
                <div className="bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-100 p-6 sm:w-48 flex flex-col justify-center shrink-0">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="font-bold text-sm text-gray-700 uppercase tracking-wide">{order.status}</span>
                  </div>
                  
                  <Link href={order.ticketLink} className="w-full">
                    <button className="w-full bg-white border border-[#f84464] text-[#f84464] hover:bg-red-50 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm">
                      View E-Ticket
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
