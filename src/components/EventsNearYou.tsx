import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "Sunburn Goa 2026",
    genre: "Music/EDM",
    image: "/assets/et00452034-qrgdyxqlhb-portrait.jpg"
  },
  {
    id: 2,
    title: "Arijit Singh Live",
    genre: "Concert",
    image: "/bookmyshow home page_files/et00013821-aenbdsjmra-portrait.jpg"
  },
  {
    id: 3,
    title: "Zakir Khan - Live",
    genre: "Comedy",
    image: "/bookmyshow home page_files/et00014607-zprugspkdm-portrait.jpg"
  },
  {
    id: 4,
    title: "Jo Bolta Hai Wohi Hota Hai",
    genre: "Comedy",
    image: "/bookmyshow home page_files/et00402857-wmrfdfrzuc-portrait.jpg"
  },
  {
    id: 5,
    title: "Komedian in Pune",
    genre: "Comedy",
    image: "/bookmyshow home page_files/et00409218-vfejueytwx-portrait.jpg"
  }
];

export default function EventsNearYou() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Happening Near You</h2>
        <Link href="/events" className="flex items-center text-[#dc3558] hover:text-[#b82947] text-sm font-semibold transition">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory hide-scrollbar">
        {EVENTS.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="group shrink-0 w-[220px] snap-start flex flex-col gap-3 cursor-pointer">
            <div className="w-full rounded-lg overflow-hidden shadow-md">
              <Image 
                src={event.image} 
                alt={event.title} 
                width={220}
                height={330}
                className="w-full h-auto object-contain group-hover:scale-105 transition duration-300"
                style={{ width: '100%', height: 'auto' }}
                unoptimized
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{event.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{event.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
