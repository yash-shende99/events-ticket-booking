import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import { Event } from "@/models/Event";
import { Showtime } from "@/models/Showtime";
import EventsExploreClient from "@/components/events/EventsExploreClient";

export const metadata = {
  title: "Events, Concerts & Comedy Shows | Book Tickets Online",
  description: "Check out the latest events in your city.",
};

export default async function EventsPage() {
  await connectDB();
  
  // Fetch unified events
  const movieEvents = await Movie.find({ eventType: "Event", status: "Published" }).lean();
  
  // Fetch old standalone events
  const oldEvents = await Event.find({}).lean();
  
  // Fetch first showtime for each new event to get date and location
  const mappedNewEvents = await Promise.all(movieEvents.map(async (ev: any) => {
     const showtime = await Showtime.findOne({ movie: ev._id }).sort({ date: 1 }).lean();
     return {
        _id: ev._id,
        title: ev.title,
        category: ev.genres && ev.genres.length > 0 ? ev.genres[0] : "Event",
        languages: ev.languages || [],
        price: ev.basePricing && ev.basePricing.length > 0 ? `₹${ev.basePricing[0].price} onwards` : "₹500 onwards",
        poster: ev.poster,
        imageUrl: ev.heroImage,
        date: showtime ? showtime.date : "Multiple Dates",
        location: showtime ? (showtime.eventLocation || "Pune") : "Pune",
     };
  }));

  const allEvents = [...oldEvents, ...mappedNewEvents];
  const serializedEvents = JSON.parse(JSON.stringify(allEvents));

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <EventsExploreClient initialEvents={serializedEvents} />
    </div>
  );
}
