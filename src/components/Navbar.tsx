import Image from "next/image";
import Link from "next/link";
import { Search, Menu, ChevronDown, UserCircle } from "lucide-react";
import { cookies } from "next/headers";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const isAuthenticated = !!token;
  return (
    <nav className="w-full bg-white text-gray-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-[68px]">
        {/* Left Side: Logo & Search */}
        <div className="flex items-center gap-6 flex-1">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold tracking-tighter text-gray-900">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded flex-1 max-w-[600px] h-9 px-3 gap-2">
            <Search className="text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              className="w-full bg-transparent text-black text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Side: Location & Sign In */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 cursor-pointer text-sm hover:text-gray-600 transition">
            Mumbai
            <ChevronDown className="w-4 h-4" />
          </div>
          
          {isAuthenticated ? (
            <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition">
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-medium hidden sm:inline-block">Profile</span>
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-[#f84464] hover:bg-[#d83552] text-white text-xs font-semibold px-4 py-1.5 rounded transition">
                Sign in
              </button>
            </Link>
          )}
          
          <Menu className="w-6 h-6 cursor-pointer hover:text-gray-600 transition" />
        </div>
      </div>
    </nav>
  );
}
