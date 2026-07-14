import connectDB from '@/lib/db';
import { Event } from '@/models/Event';
import { Movie } from '@/models/Movie';
import { Showtime } from '@/models/Showtime';
import { notFound } from 'next/navigation';
import EventDetailsClient from '@/components/events/EventDetailsClient';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectDB();
  
  // 1. Try to find in old Event collection
  let event = await Event.findById(resolvedParams.id).lean();
  let mappedEvent: any = null;

  if (event) {
    mappedEvent = {
      ...event,
      _id: event._id.toString(),
    };
  } else {
    // 2. If not found, try to find in new unified Movie collection
    const movieEvent = await Movie.findById(resolvedParams.id).lean();
    
    if (!movieEvent || movieEvent.eventType !== "Event") {
      notFound();
    }
    
    // Fetch showtime for date/location
    const showtime = await Showtime.findOne({ movie: movieEvent._id }).sort({ date: 1 }).lean();
    
    mappedEvent = {
      _id: movieEvent._id.toString(),
      title: movieEvent.title,
      category: movieEvent.genres && movieEvent.genres.length > 0 ? movieEvent.genres[0] : "Event",
      languages: movieEvent.languages || [],
      price: movieEvent.basePricing && movieEvent.basePricing.length > 0 ? `₹${movieEvent.basePricing[0].price} onwards` : "₹500 onwards",
      poster: movieEvent.poster,
      imageUrl: movieEvent.heroImage,
      date: showtime ? showtime.date : "Multiple Dates",
      location: showtime ? (showtime.eventLocation || "Pune") : "Pune",
      description: movieEvent.description,
    };
  }

  return <EventDetailsClient event={mappedEvent} />;
}