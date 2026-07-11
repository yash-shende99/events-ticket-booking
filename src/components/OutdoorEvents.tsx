import Image from "next/image";

const OUTDOOR_EVENTS = [
  { id: 1, title: "Outdoor Events", image: "/bookmyshow home page_files/adventure-fun-collection-202211140440.png" },
  { id: 2, title: "Laughter Therapy", image: "/bookmyshow home page_files/comedy-shows-collection-202211140440.png" },
  { id: 3, title: "Popular Events", image: "/bookmyshow home page_files/theatre-shows-collection-202211140440.png" }
];

export default function OutdoorEvents() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Fun Activities</h2>
      
      <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
        {OUTDOOR_EVENTS.map((event) => (
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
