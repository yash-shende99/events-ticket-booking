import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { redirect } from "next/navigation";
import { Waitlist } from "@/models/Waitlist";
import { Clock, Ticket, AlertCircle, CheckCircle2 } from "lucide-react";

// Ensure all schemas are registered
import "@/models/Movie";
import "@/models/Showtime";
import "@/models/Theater";

export default async function WaitlistsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  // Fetch Waitlists for User
  // Also checking email fallback in case they joined as guest but now logged in with same email
  const waitlists = await Waitlist.find({
    $or: [
      { userId: session.user.id },
      { email: session.user.email }
    ]
  })
    .populate({
      path: "showtimeId",
      populate: [{ path: "movie" }, { path: "theater" }],
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Waitlists</h1>
          <p className="text-gray-500 mt-1">Track your position in line for sold-out shows.</p>
        </div>
      </div>

      <div className="space-y-4">
        {waitlists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Waitlists</h3>
            <p className="text-gray-500">You are not currently queued for any sold-out shows.</p>
          </div>
        ) : (
          waitlists.map((entry: any) => {
            const movie = entry.showtimeId?.movie;
            const theater = entry.showtimeId?.theater;
            const st = entry.showtimeId;

            // Determine status styling
            let statusColor = "bg-orange-50 text-orange-600 border-orange-200";
            let StatusIcon = Clock;
            let statusText = "Waiting in Queue";

            if (entry.status === "notified") {
              statusColor = "bg-green-50 text-green-700 border-green-200";
              StatusIcon = CheckCircle2;
              statusText = "Seats Available! Check Email";
            } else if (entry.status === "booked") {
              statusColor = "bg-blue-50 text-blue-600 border-blue-200";
              StatusIcon = Ticket;
              statusText = "Successfully Claimed";
            } else if (entry.status === "expired") {
              statusColor = "bg-red-50 text-red-600 border-red-200";
              StatusIcon = AlertCircle;
              statusText = "Claim Window Expired";
            }

            return (
              <div key={entry._id.toString()} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden relative shrink-0">
                    <img 
                      src={movie?.poster || "/placeholder.jpg"} 
                      alt={movie?.title || "Movie"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{movie?.title || "Unknown Movie"}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {theater?.name} • {st?.date} • {st?.time}
                    </p>
                    <div className="flex gap-3 text-xs font-medium text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">Tickets Needed: {entry.seatsNeeded}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">Category: {entry.category}</span>
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${statusColor} min-w-[200px] justify-center shrink-0`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{statusText}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
