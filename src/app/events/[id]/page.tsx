import connectDB from '@/lib/db';
import { Event } from '@/models/Event';
import { notFound } from 'next/navigation';
import EventDetailsClient from '@/components/events/EventDetailsClient';

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectDB();
  const event = await Event.findById(resolvedParams.id).lean();

  if (!event) {
    notFound();
  }

  // Convert MongoDB _id to string
  const safeEvent = {
    ...event,
    _id: event._id.toString(),
  };

  return <EventDetailsClient event={safeEvent} />;
}