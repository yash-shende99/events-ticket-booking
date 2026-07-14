"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, UserPlus, Shield, ShieldAlert, Key, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Mock Data for MVP
const INITIAL_STAFF = [
  { id: 1, name: "Rahul Sharma", email: "rahul@venue.com", role: "Manager", status: "Active" },
  { id: 2, name: "Priya Patel", email: "priya@venue.com", role: "Ticket Checker", status: "Active" },
  { id: 3, name: "Amit Kumar", email: "amit@venue.com", role: "Ticket Checker", status: "Inactive" },
  { id: 4, name: "Sneha Reddy", email: "sneha@venue.com", role: "Accountant", status: "Active" },
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "Ticket Checker" });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return toast.error("Please fill all fields");
    
    setStaff([...staff, { ...newStaff, id: Date.now(), status: "Pending Invite" }]);
    setShowAddModal(false);
    setNewStaff({ name: "", email: "", role: "Ticket Checker" });
    toast.success("Staff invite sent!");
  };

  const removeStaff = (id: number) => {
    if (confirm("Are you sure you want to revoke access for this staff member?")) {
      setStaff(staff.filter(s => s.id !== id));
      toast.success("Staff access revoked");
    }
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
          <span>ℹ️</span> This section is for Theatre & Place Owners (Venue Management), not Event Organizers.
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/organiser" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-[#f84464]" /> Staff Management
              </h1>
              <p className="text-gray-500">Manage venue staff roles, permissions, and accounts.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#f84464] hover:bg-[#e03a58] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
          >
            <UserPlus className="w-5 h-5" /> Add Staff Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Manager</h3>
              <p className="text-sm text-gray-500">Full dashboard access</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Ticket Checker</h3>
              <p className="text-sm text-gray-500">Validation app access only</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Accountant</h3>
              <p className="text-sm text-gray-500">Financial reports access only</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        member.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                        member.role === 'Accountant' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        member.status === 'Active' ? 'text-green-600' : 
                        member.status === 'Inactive' ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'Active' ? 'bg-green-500' : 
                          member.status === 'Inactive' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></span>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 p-2 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeStaff(member.id)} className="text-gray-400 hover:text-red-600 p-2 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Add Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Role</label>
                <select className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#f84464]" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                  <option value="Ticket Checker">Ticket Checker</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition">Cancel</button>
                <button type="submit" className="flex-1 bg-[#f84464] hover:bg-[#e03a58] text-white font-bold py-2 rounded-lg transition">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
