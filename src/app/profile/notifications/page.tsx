"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, Globe, Megaphone, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/user/notifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <Bell className="w-6 h-6 text-[#f84464]" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell className="w-12 h-12 text-gray-200 mb-4" />
            <p>No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`mt-1 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.type === "GLOBAL" ? "bg-blue-100 text-blue-600" :
                  notif.type === "PROMO" ? "bg-red-100 text-[#f84464]" :
                  "bg-amber-100 text-amber-600"
                }`}>
                  {notif.type === "GLOBAL" && <Globe className="w-5 h-5" />}
                  {notif.type === "PROMO" && <Megaphone className="w-5 h-5" />}
                  {notif.type === "WAITLIST" && <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{notif.subject}</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
