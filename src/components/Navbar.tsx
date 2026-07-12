import Image from "next/image";
import Link from "next/link";
import { Search, Menu, ChevronDown, UserCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserMenuClient from "./UserMenuClient";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
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

        {/* Right Side: Location & Menu */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 cursor-pointer text-sm hover:text-gray-600 transition">
            Mumbai
            <ChevronDown className="w-4 h-4" />
          </div>
          
          <UserMenuClient isAuthenticated={isAuthenticated} userName={session?.user?.name} />
        </div>
      </div>
    </nav>
  );
}
