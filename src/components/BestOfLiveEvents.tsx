import Image from "next/image";

const LIVE_EVENTS = [
  { id: 1, title: "Adventure & Fun", image: "/bookmyshow home page_files/adventure-fun-collection-202211140440.png" },
  { id: 2, title: "Comedy Shows", image: "/bookmyshow home page_files/comedy-shows-collection-202211140440.png" },
  { id: 3, title: "Theatre Shows", image: "/bookmyshow home page_files/theatre-shows-collection-202211140440.png" },
  { id: 4, title: "Kids", image: "/bookmyshow home page_files/kids-banner-desktop-collection-202503251132.png" },
  { id: 5, title: "Amusement Parks", image: "/bookmyshow home page_files/amusement-parks-banner-desktop-collection-202503251132.png" }
];

export default function BestOfLiveEvents() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">The Best of Live Events</h2>
      
      <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
        {LIVE_EVENTS.map((event) => (
          <div key={event.id} className="group shrink-0 w-[220px] snap-start cursor-pointer">
            <div className="w-[220px] h-[220px] relative rounded-lg overflow-hidden shadow-sm bg-gray-200">
              <Image 
                src={event.image} 
                alt={event.title} 
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
