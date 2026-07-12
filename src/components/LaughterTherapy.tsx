import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Event } from "@/models/Event";
import connectDB from "@/lib/db";

export default async function LaughterTherapy() {
  await connectDB();
  const comedyEvents = await Event.find({ category: "Comedy Shows" }).sort({ _id: -1 }).lean();

  if (!comedyEvents || comedyEvents.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#2b3149] py-12 mt-8">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Laughter Therapy</h2>
            <p className="text-white text-sm">Your weekly dose of comedy and fun</p>
          </div>
          <Link href="/events?category=Comedy Shows" className="flex items-center text-[#dc3558] hover:text-[#f84464] text-sm font-semibold transition">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory hide-scrollbar">
          {comedyEvents.map((event: any) => (
            <Link key={event._id.toString()} href={`/events/${event._id}`} className="group shrink-0 w-[200px] snap-start flex flex-col gap-2 cursor-pointer">
              <div className="w-full h-[300px] relative rounded-xl overflow-hidden shadow-md bg-gray-200">
                <Image 
                  src={event.poster} 
                  alt={event.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized
                />
                {/* Overlay styling */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2b3149]/90 to-transparent px-3 py-3">
                  <span className="text-white text-sm font-bold">{event.date}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base text-white line-clamp-1">{event.title}</h3>
                <p className="text-gray-300 text-xs mt-0.5">{event.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
