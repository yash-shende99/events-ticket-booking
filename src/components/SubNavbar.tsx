import Link from "next/link";
import ListYourShowLink from "./ListYourShowLink";

export default function SubNavbar() {
  return (
    <nav className="w-full bg-[#f5f5f5] text-gray-700 text-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-10">
        {/* Left Links */}
        <div className="flex items-center gap-6">
          <Link href="/movies" className="hover:text-gray-900 transition">Movies</Link>
          <Link href="/events" className="hover:text-gray-900 transition">Events</Link>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6 text-xs">
          <ListYourShowLink />
          <Link href="/corporates" className="hover:text-gray-900 transition">Corporates</Link>
          <Link href="/offers" className="hover:text-gray-900 transition">Offers</Link>
        </div>
      </div>
    </nav>
  );
}
