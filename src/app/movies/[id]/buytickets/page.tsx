import { notFound } from "next/navigation";
import { Movie } from "@/models/Movie";
import connectDB from "@/lib/db";
import Navbar from "@/components/Navbar";
import SubNavbar from "@/components/SubNavbar";
import Footer from "@/components/Footer";
import ShowtimesContainer from "@/components/buytickets/ShowtimesContainer";

export default async function BuyTicketsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const format = resolvedSearchParams.format as string || "2D";
  const lang = resolvedSearchParams.lang as string || "Hindi";

  await connectDB();
  
  let MOVIE;
  try {
    MOVIE = await Movie.findById(resolvedParams.id).lean();
  } catch (error) {
    MOVIE = null;
  }

  if (!MOVIE) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <SubNavbar />
      
      {/* Top Info Bar */}
      <div className="bg-[#333333] text-white pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-bold mb-2 tracking-wide text-white">
            {MOVIE.title} - {lang}
          </h1>
          <div className="flex items-center gap-4 text-sm mt-3">
            <span className="border border-gray-400 rounded-full px-2 py-0.5 text-xs text-gray-300 font-medium">
              {MOVIE.certification}
            </span>
            <span className="flex gap-2">
              {MOVIE.genres.map((g: string, idx: number) => (
                <span key={idx} className="border border-white/30 px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-white/10 hover:bg-white/20 cursor-pointer transition">
                  {g}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
      
      <ShowtimesContainer />

      <Footer />
    </div>
  );
}
