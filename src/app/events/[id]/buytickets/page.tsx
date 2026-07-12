import { notFound } from "next/navigation";
import { Event } from "@/models/Event";
import connectDB from "@/lib/db";
import EventTicketsClient from "@/components/events/buytickets/EventTicketsClient";
import React from "react";

export default async function EventBuyTicketsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  
  await connectDB();
  
  let event;
  try {
    event = await Event.findById(resolvedParams.id).lean();
  } catch (error) {
    event = null;
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top Header matching movies dark theme */}
      <div className="bg-[#333333] text-white pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-wide text-white">
              {event.title}
            </h1>
            <div className="text-gray-300 text-sm mt-2 flex items-center gap-2">
              <span className="border border-gray-400 rounded-full px-3 py-0.5 font-medium">{event.category || 'Event'}</span>
              <span>•</span>
              <span>Pune</span>
            </div>
          </div>
          
          {/* Breadcrumb Steps */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300 font-medium mt-4 md:mt-0">
             <div className="flex flex-col items-center">
                <span className="bg-[#f84464] text-white w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-md">1</span>
                <span className="text-[#f84464] font-semibold">Ticket</span>
             </div>
             <div className="h-[2px] w-10 bg-gray-600 rounded"></div>
             <div className="flex flex-col items-center">
                <span className="bg-gray-600 text-gray-300 w-7 h-7 rounded-full flex items-center justify-center mb-1">2</span>
                <span>Ticket Mode</span>
             </div>
             <div className="h-[2px] w-10 bg-gray-600 rounded"></div>
             <div className="flex flex-col items-center opacity-50">
                <span className="bg-gray-600 text-gray-300 w-7 h-7 rounded-full flex items-center justify-center mb-1">3</span>
                <span>Review</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Main Client Component - Serialize the Mongoose Object */}
      <EventTicketsClient event={JSON.parse(JSON.stringify(event))} />
    </div>
  );
}
