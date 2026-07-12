"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Phone, ChevronDown, ChevronUp, Search, Ticket, CreditCard, UserCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "Tickets & Booking",
    icon: <Ticket className="w-5 h-5" />,
    questions: [
      { q: "How do I download my E-Ticket?", a: "You can find your E-Tickets in the 'Your Orders' section under your profile. Simply click 'View E-Ticket' on any confirmed booking to download or screenshot the QR code." },
      { q: "Can I cancel or transfer my movie ticket?", a: "Currently, ticket cancellations are only allowed up to 4 hours before the showtime for select cinemas. Transfers are not officially supported, but you can share the E-Ticket QR code with your friend." },
      { q: "I haven't received my booking confirmation email.", a: "Please check your spam or promotions folder. If the payment was deducted but no ticket was generated, it will automatically be refunded within 3-5 business days." }
    ]
  },
  {
    category: "Payments & Refunds",
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      { q: "What payment methods are accepted?", a: "We accept all major Credit/Debit cards, UPI, Net Banking, and select digital wallets through our Razorpay secure gateway." },
      { q: "When will I get my refund for a failed transaction?", a: "Failed transactions are automatically reconciled. The amount will reflect in your original payment method within 3 to 5 business days." }
    ]
  },
  {
    category: "Profile & Settings",
    icon: <UserCircle className="w-5 h-5" />,
    questions: [
      { q: "How do I update my email address?", a: "You can update your personal information in the 'Accounts & Settings' section under your profile dashboard." }
    ]
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>("How do I download my E-Ticket?");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (q: string) => {
    setOpenFaq(openFaq === q ? null : q);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#2b3148] to-[#1a1e2d] rounded-2xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Hello, how can we help you?</h1>
            <p className="text-gray-300 mb-8 max-w-xl text-lg">Find answers to commonly asked questions or get in touch with our dedicated support team.</p>
            
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for answers (e.g., refunds, tickets)..." 
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f84464] shadow-sm text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Options */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
              <p className="text-sm text-gray-500">Typical reply in 5 minutes</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
              <p className="text-sm text-gray-500">help@eventsbooking.com</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
              <p className="text-sm text-gray-500">1800-123-4567 (Toll Free)</p>
            </div>
          </div>

          {/* Right Column: FAQs */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-8">
                {FAQS.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      <span className="text-gray-400">{category.icon}</span>
                      {category.category}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.questions
                        .filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((faq, fIdx) => (
                        <div 
                          key={fIdx} 
                          className={`border rounded-lg overflow-hidden transition-colors ${openFaq === faq.q ? 'border-[#f84464]/30 bg-red-50/30' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                        >
                          <button 
                            className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                            onClick={() => toggleFaq(faq.q)}
                          >
                            <span className={`font-medium pr-4 ${openFaq === faq.q ? 'text-[#f84464]' : 'text-gray-700'}`}>
                              {faq.q}
                            </span>
                            {openFaq === faq.q ? (
                              <ChevronUp className="w-5 h-5 text-[#f84464] shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          
                          {openFaq === faq.q && (
                            <div className="px-5 pb-4 pt-1 text-gray-600 text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
