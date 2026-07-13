"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserCircle, Menu, ChevronRight, Bell, ShoppingBag, Heart, MessageCircle, Settings, LogOut, X, Info, TrendingUp, Film, PlusCircle, Calendar } from "lucide-react";

interface UserMenuClientProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export default function UserMenuClient({ isAuthenticated, userName }: UserMenuClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isOrganiserRoute = pathname?.startsWith("/organiser");

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const customerMenuItems = [
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5 text-gray-500" />,
      href: "/profile/notifications"
    },
    {
      title: "Your Orders",
      subtitle: "View all your bookings & purchases",
      icon: <ShoppingBag className="w-5 h-5 text-gray-500" />,
      href: "/profile/orders"
    },
    {
      title: "Your Waitlists",
      subtitle: "View your queue positions",
      icon: <Bell className="w-5 h-5 text-gray-500" />,
      href: "/profile/waitlists"
    },
    {
      title: "Your Wishlist",
      icon: <Heart className="w-5 h-5 text-gray-500" />,
      href: "/profile/wishlist"
    },
    {
      title: "Help & Support",
      subtitle: "View commonly asked queries and Chat",
      icon: <MessageCircle className="w-5 h-5 text-gray-500" />,
      href: "/support"
    },
    {
      title: "Accounts & Settings",
      subtitle: "Location, Payments, Permissions & More",
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      href: "/profile/settings"
    }
  ];

  const organiserMenuItems = [
    {
      title: "Dashboard",
      subtitle: "View your analytics",
      icon: <TrendingUp className="w-5 h-5 text-gray-500" />,
      href: "/organiser"
    },
    {
      title: "Create Listing",
      subtitle: "Publish a new event or movie",
      icon: <PlusCircle className="w-5 h-5 text-gray-500" />,
      href: "/organiser/create-event"
    },
    {
      title: "Settings",
      subtitle: "Profile & Branding",
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      href: "/organiser/settings"
    }
  ];

  const menuItems = isOrganiserRoute ? organiserMenuItems : customerMenuItems;

  return (
    <>
      {/* Desktop Profile Icon */}
      {isAuthenticated ? (
        <div 
          onClick={toggleMenu}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <UserCircle className="w-6 h-6" />
          <span className="text-sm font-medium hidden sm:inline-block">Profile</span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="bg-[#f84464] hover:bg-[#d83552] text-white text-xs font-semibold px-4 py-1.5 rounded transition">
              Sign in
            </button>
          </Link>
          <Menu onClick={toggleMenu} className="w-6 h-6 cursor-pointer hover:text-gray-600 transition" />
        </div>
      )}

      {isAuthenticated && (
        <Menu onClick={toggleMenu} className="w-6 h-6 cursor-pointer hover:text-gray-600 transition sm:hidden" />
      )}

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hey{userName ? `, ${userName}` : '!'}</h2>
            {isAuthenticated ? (
              <p className="text-sm text-[#f84464] cursor-pointer hover:underline mt-1">Edit Profile &gt;</p>
            ) : (
              <p className="text-sm text-[#f84464] cursor-pointer hover:underline mt-1">Sign in to sync your profile &gt;</p>
            )}
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
            <UserCircle className="w-7 h-7 text-gray-400" />
          </div>
        </div>

        {/* WhatsApp Banner */}
        <div className="bg-amber-50/60 p-4 border-b border-gray-100 flex items-start gap-3 cursor-pointer hover:bg-amber-50 transition-colors">
          <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium">Get tickets on Whatsapp/SMS!</p>
            <p className="text-xs text-gray-500 mt-0.5">Add your Mobile Number</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col py-2">
            {menuItems.map((item, idx) => (
              <Link 
                href={item.href} 
                key={idx}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
              >
                <div className="shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-medium text-gray-800">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-[12px] text-gray-500 mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {isAuthenticated ? (
            <button 
              className="w-full py-3 rounded-lg border border-[#f84464] text-[#f84464] font-semibold hover:bg-red-50 transition-colors"
              onClick={async () => {
                setIsOpen(false);
                await signOut({ callbackUrl: "/" });
              }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <button className="w-full py-3 rounded-lg bg-[#f84464] text-white font-semibold hover:bg-[#d83552] transition-colors">
                Sign in
              </button>
            </Link>
          )}
        </div>

        {/* Close Button Handle (Optional, but good for mobile) */}
        <button 
          onClick={toggleMenu}
          className="absolute top-5 -left-12 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
