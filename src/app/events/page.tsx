import connectDB from "@/lib/db";
import { Event } from "@/models/Event";
import EventsExploreClient from "@/components/events/EventsExploreClient";

export const metadata = {
  title: "Events, Concerts & Comedy Shows | Book Tickets Online",
  description: "Check out the latest events in your city.",
};

export default async function EventsPage() {
  await connectDB();
  const events = await Event.find({}).lean();

  const serializedEvents = JSON.parse(JSON.stringify(events));

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <EventsExploreClient initialEvents={serializedEvents} />
    </div>
  );
}
