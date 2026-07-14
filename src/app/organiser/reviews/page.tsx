"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare, ThumbsUp, Send } from "lucide-react";
import toast from "react-hot-toast";

// Mock Data for MVP
const INITIAL_REVIEWS = [
  { 
    id: 1, 
    movie: "Inception 10th Anniversary", 
    customer: "Ravi Verma", 
    rating: 5, 
    date: "2026-06-15", 
    text: "Amazing experience! The sound quality at the venue was phenomenal.",
    reply: "Thank you Ravi! We're glad you enjoyed the show."
  },
  { 
    id: 2, 
    movie: "Comedy Night Live", 
    customer: "Neha Sharma", 
    rating: 3, 
    date: "2026-06-10", 
    text: "The show was good but the AC wasn't working properly in our section.",
    reply: ""
  },
  { 
    id: 3, 
    movie: "Coldplay Tribute Concert", 
    customer: "Karan Singh", 
    rating: 4, 
    date: "2026-06-05", 
    text: "Great vibe, entry process could have been faster.",
    reply: ""
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  const handleSendReply = (id: number) => {
    const text = replyText[id];
    if (!text || text.trim() === "") return;

    setReviews(reviews.map(r => r.id === id ? { ...r, reply: text } : r));
    setReplyText({ ...replyText, [id]: "" });
    toast.success("Reply posted publicly");
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/organiser">
            <span className="text-3xl font-bold tracking-tighter text-gray-900">
              Cine<span className="text-[#f84464]">Verse</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <h1 className="text-lg font-bold text-gray-700 tracking-tight">Organiser Hub</h1>
        </div>
        <Link href="/organiser" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-[#f84464]" /> Reviews & Ratings
            </h1>
            <p className="text-gray-500">Read what attendees are saying and reply to their feedback.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-4xl font-black text-gray-900 mb-2">4.2</h3>
            <div className="flex justify-center mb-2">{renderStars(4)}</div>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-4xl font-black text-gray-900 mb-2">1,245</h3>
            <p className="text-sm text-gray-500 mt-2">Total Reviews</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-4xl font-black text-[#f84464] mb-2">92%</h3>
            <p className="text-sm text-gray-500 mt-2">Positive Feedback</p>
          </div>
        </div>

        {/* Review Feed */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{review.customer}</h3>
                  <p className="text-sm text-[#f84464] font-medium">Event: {review.movie}</p>
                </div>
                <div className="text-right">
                  <div className="flex justify-end mb-1">{renderStars(review.rating)}</div>
                  <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.text}</p>
              
              {review.reply ? (
                <div className="bg-gray-50 border-l-4 border-[#f84464] p-4 rounded-r-lg mt-4">
                  <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Your Reply</p>
                  <p className="text-sm text-gray-700">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Write a public reply..." 
                    className="flex-1 border rounded-lg px-4 py-2 outline-none focus:border-[#f84464] text-sm"
                    value={replyText[review.id] || ""}
                    onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleSendReply(review.id)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                  >
                    Reply <Send className="w-4 h-4"/>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
