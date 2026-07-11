import { Info } from "lucide-react";

const THEATERS = [
  {
    name: "PVR ICON: Infinity Andheri (W)",
    amenities: ["M-Ticket", "Food & Beverage"],
    shows: [
      { time: "09:00 AM", status: "available" },
      { time: "11:30 AM", status: "filling" },
      { time: "02:15 PM", status: "available" },
      { time: "06:00 PM", status: "filling" },
      { time: "10:30 PM", status: "available" }
    ]
  },
  {
    name: "Cinepolis: VIP Viviana Mall, Thane",
    amenities: ["M-Ticket"],
    shows: [
      { time: "10:15 AM", status: "available" },
      { time: "01:45 PM", status: "available" },
      { time: "05:20 PM", status: "filling" },
      { time: "09:00 PM", status: "almost-full" }
    ]
  },
  {
    name: "INOX: R-City, Ghatkopar",
    amenities: ["M-Ticket", "Food & Beverage", "Recliner"],
    shows: [
      { time: "08:45 AM", status: "available" },
      { time: "12:30 PM", status: "available" },
      { time: "04:15 PM", status: "available" },
      { time: "07:30 PM", status: "almost-full" },
      { time: "11:00 PM", status: "filling" }
    ]
  },
  {
    name: "MovieTime: Hub Mall, Goregaon",
    amenities: ["Food & Beverage"],
    shows: [
      { time: "11:00 AM", status: "available" },
      { time: "02:30 PM", status: "available" },
      { time: "08:00 PM", status: "available" }
    ]
  }
];

export default function TheaterList() {
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="bg-white rounded-md shadow-sm border overflow-hidden">
          {/* Header Legend */}
          <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-end gap-6 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#4abd5d]"></div> Available</span>
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#ff9900]"></div> Fast Filling</span>
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#f84464]"></div> Almost Full</span>
          </div>

          {/* List */}
          <div>
            {THEATERS.map((theater, idx) => (
              <div key={idx} className="border-b last:border-0 p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition">
                <div className="md:w-1/3">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    {theater.name}
                    <Info className="w-4 h-4 text-gray-400" />
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {theater.amenities.map((amenity, aIdx) => (
                      <span key={aIdx} className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3 flex flex-wrap gap-4 items-center">
                  {theater.shows.map((show, sIdx) => {
                    let colorClass = "text-[#4abd5d] border-[#4abd5d]";
                    if (show.status === "filling") colorClass = "text-[#ff9900] border-[#ff9900]";
                    if (show.status === "almost-full") colorClass = "text-[#f84464] border-[#f84464]";

                    return (
                      <button 
                        key={sIdx} 
                        className={`px-6 py-2 rounded-md border ${colorClass} hover:shadow-md transition text-xs font-semibold bg-white flex flex-col items-center justify-center gap-1`}
                      >
                        {show.time}
                        <span className="text-[9px] font-normal text-gray-500">Dolby 7.1</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
