"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ListYourShowLink() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (session?.user?.role === "user") {
      e.preventDefault();
      toast.error("You are logged in as a normal user. Please logout first to access the Organizer portal.", { icon: "⚠️" });
    } else if (session?.user?.role === "organiser" || session?.user?.role === "admin") {
      e.preventDefault();
      router.push("/organiser"); // Route straight to dashboard if already an organizer
    }
    // If not logged in, it will natively route to /organiser/register as defined in the href
  };

  return (
    <Link 
      href="/organiser/register" 
      onClick={handleClick}
      className="hover:text-gray-900 transition"
    >
      ListYourShow
    </Link>
  );
}
