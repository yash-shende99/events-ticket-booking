import connectDB from "@/lib/db";
import { Movie } from "@/models/Movie";
import MoviesExploreClient from "@/components/movies/MoviesExploreClient";

export const revalidate = 60; // Cache for 60s, avoid full DB hit on every request

export const metadata = {
  title: "Movies in Theatres | Book Tickets Online",
  description: "Check out the latest movies in theatres. Book tickets online for the latest movies.",
};

export default async function MoviesPage() {
  await connectDB();
  // Only fetch fields needed for the listing to keep payload small & fast
  const movies = await Movie.find({ eventType: { $ne: "Event" } }).sort({ isFeatured: -1, _id: -1 }).select(
    'title poster genres formats languages certification rating votes'
  ).lean();

  const serializedMovies = JSON.parse(JSON.stringify(movies));

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <MoviesExploreClient initialMovies={serializedMovies} />
    </div>
  );
}
