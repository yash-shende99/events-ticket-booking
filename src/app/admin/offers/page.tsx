"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Plus, Edit2, Trash2, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    iconName: "Tag",
    bgGradient: "bg-blue-50 border-blue-100",
    validity: "",
    category: "General",
    code: "",
    discountPercentage: 0,
    maxDiscount: 0,
    isActive: true,
  });

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/admin/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      toast.error("Could not load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        subtitle: offer.subtitle,
        iconName: offer.iconName,
        bgGradient: offer.bgGradient,
        validity: offer.validity,
        category: offer.category,
        code: offer.code || "",
        discountPercentage: offer.discountPercentage || 0,
        maxDiscount: offer.maxDiscount || 0,
        isActive: offer.isActive,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: "",
        subtitle: "",
        iconName: "Tag",
        bgGradient: "bg-blue-50 border-blue-100",
        validity: "",
        category: "General",
        code: "",
        discountPercentage: 0,
        maxDiscount: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingOffer ? `/api/admin/offers/${editingOffer._id}` : "/api/admin/offers";
      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save offer");
      }

      toast.success(editingOffer ? "Offer updated!" : "Offer created!");
      setIsModalOpen(false);
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Offer deleted");
      fetchOffers();
    } catch (error) {
      toast.error("Could not delete offer");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      fetchOffers();
    } catch (error) {
      toast.error("Could not update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <div className="flex items-center cursor-pointer">
              <span className="text-3xl font-bold tracking-tighter text-gray-900">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div>
            <h1 className="text-lg font-bold text-gray-700 tracking-tight">Global Headquarters</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
            Back to Command Center
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-8 h-8 text-[#f84464]" /> Offers & Coupons
              </h1>
              <p className="text-gray-500">Manage promotional banners and discount codes across the platform.</p>
            </div>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#f84464] hover:bg-[#e03a58] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-5 h-5" /> Create Offer
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-6">Offer Details</th>
                  <th className="p-6">Promo Code</th>
                  <th className="p-6">Discount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading offers...</td></tr>
                ) : offers.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">No offers found. Create one above!</td></tr>
                ) : (
                  offers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{offer.title}</p>
                          <p className="text-sm text-gray-500 max-w-xs truncate">{offer.subtitle}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                            {offer.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        {offer.code ? (
                          <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-800 font-bold border border-gray-200">
                            {offer.code}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Auto-Applied</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">{offer.discountPercentage}% OFF</p>
                          {offer.maxDiscount > 0 && <p className="text-gray-500">Max ₹{offer.maxDiscount}</p>}
                        </div>
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => toggleStatus(offer._id, offer.isActive)}
                          className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors ${
                            offer.isActive ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(offer._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Offer Title *</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Buy 1 Get 1 Free"
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Promo Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent font-mono uppercase"
                    value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="Leave blank for auto-applied"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle / Description *</label>
                  <textarea required rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Describe the offer details..."
                  ></textarea>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount Percentage (%)</label>
                  <input
                    type="number" min="0" max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: Number(e.target.value)})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Max Discount Amount (₹)</label>
                  <input
                    type="number" min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Validity Text *</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})}
                    placeholder="e.g. Valid till 31st August"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Theme Color</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f84464] focus:border-transparent"
                    value={formData.bgGradient} onChange={(e) => setFormData({...formData, bgGradient: e.target.value})}
                  >
                    <option value="bg-blue-50 border-blue-100">Blue Theme</option>
                    <option value="bg-orange-50 border-orange-100">Orange Theme</option>
                    <option value="bg-rose-50 border-rose-100">Red Theme</option>
                    <option value="bg-purple-50 border-purple-100">Purple Theme</option>
                    <option value="bg-green-50 border-green-100">Green Theme</option>
                  </select>
                </div>
                
                <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 text-[#f84464] rounded focus:ring-[#f84464]"
                  />
                  <label htmlFor="isActive" className="font-bold text-gray-900 cursor-pointer">
                    Offer is Active
                  </label>
                  <p className="text-sm text-gray-500 ml-auto">Active offers are instantly visible to customers.</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="bg-[#f84464] hover:bg-[#e03a58] text-white px-8 py-2.5 rounded-lg font-bold transition shadow-sm">
                  {editingOffer ? "Save Changes" : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
