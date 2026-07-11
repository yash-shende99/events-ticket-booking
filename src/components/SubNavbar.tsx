import Link from "next/link";

export default function SubNavbar() {
  return (
    <nav className="w-full bg-[#f5f5f5] text-gray-700 text-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-10">
        {/* Left Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-gray-900 transition">Movies</Link>
          <Link href="/" className="hover:text-gray-900 transition">Stream</Link>
          <Link href="/" className="hover:text-gray-900 transition">Events</Link>
          <Link href="/" className="hover:text-gray-900 transition">Plays</Link>
          <Link href="/" className="hover:text-gray-900 transition">Sports</Link>
          <Link href="/" className="hover:text-gray-900 transition">Activities</Link>
          <Link href="/" className="hover:text-gray-900 transition">Buzz</Link>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6 text-xs">
          <Link href="/" className="hover:text-gray-900 transition">ListYourShow</Link>
          <Link href="/" className="hover:text-gray-900 transition">Corporates</Link>
          <Link href="/" className="hover:text-gray-900 transition">Offers</Link>
          <Link href="/" className="hover:text-gray-900 transition">Gift Cards</Link>
        </div>
      </div>
    </nav>
  );
}
