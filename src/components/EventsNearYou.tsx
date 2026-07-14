import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Movie } from "@/models/Movie";
import { Event } from "@/models/Event";
import { Showtime } from "@/models/Showtime";
import connectDB from "@/lib/db";

export default async function EventsNearYou() {
  await connectDB();
  const movieEvents = await Movie.find({ eventType: "Event", status: "Published" }).sort({ createdAt: -1 }).limit(10).lean();
  const oldEvents = await Event.find({}).sort({ _id: -1 }).limit(10).lean();

  // Fetch showtimes to get date and location
  const mappedNewEvents = await Promise.all(movieEvents.map(async (ev: any) => {
    const showtime = await Showtime.findOne({ movie: ev._id }).sort({ date: 1 }).lean();
    return {
       ...ev,
       category: ev.genres && ev.genres.length > 0 ? ev.genres[0] : "Event",
       date: showtime ? showtime.date : "Multiple Dates",
       location: showtime ? (showtime.eventLocation || "Pune") : "Pune",
    };
  }));

  const allEvents = [...oldEvents, ...mappedNewEvents];

  if (!allEvents || allEvents.length === 0) {
    return null;
  }

  // Shuffle or slice to 10 if necessary, but for now we can just show them all (limited by CSS scroll anyway)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Happening Near You</h2>
        <Link href="/events" className="flex items-center text-[#dc3558] hover:text-[#b82947] text-sm font-semibold transition">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
        {allEvents.map((event: any) => (
          <Link key={event._id.toString()} href={`/events/${event._id}`} className="group shrink-0 w-[200px] snap-start flex flex-col gap-2 cursor-pointer">
            <div className="w-full h-[300px] relative rounded-xl overflow-hidden shadow-md bg-gray-200">
              <Image 
                src={event.poster} 
                alt={event.title} 
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />
              {/* Date overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3">
                <span className="text-white text-sm font-bold">{event.date}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base text-gray-900 line-clamp-1">{event.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{event.category} • {event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
