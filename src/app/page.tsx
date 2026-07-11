import Navbar from "@/components/Navbar";
import SubNavbar from "@/components/SubNavbar";
import HeroCarousel from "@/components/HeroCarousel";
import RecommendedMovies from "@/components/RecommendedMovies";
import BestOfLiveEvents from "@/components/BestOfLiveEvents";
import Premieres from "@/components/Premieres";
import EventsNearYou from "@/components/EventsNearYou";
import OutdoorEvents from "@/components/OutdoorEvents";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <SubNavbar />
      
      <HeroCarousel />
      
      <RecommendedMovies />

      {/* Stream Promotional Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="w-full relative rounded-lg overflow-hidden cursor-pointer h-[150px] md:h-[200px]">
          <Image 
            src="/assets/stream-leadin-web-collection-202210241242.png" 
            alt="Stream Promotion"
            fill
            className="object-cover"
          />
        </div>
      </div>
      
      {/* Footer Spacer */}
      <div className="h-10" />

      <BestOfLiveEvents />
      <Premieres />
      <EventsNearYou />
      <OutdoorEvents />

      <Footer />
    </main>
  );
}
