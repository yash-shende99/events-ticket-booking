"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Search, UserMinus, ShieldBan, ShieldAlert, CheckCircle2, MoreVertical, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateAccountStatus = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this user as ${newStatus}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, accountStatus: newStatus })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`User successfully ${newStatus.toLowerCase()}`);
      
      // Update local state
      setUsers(users.map(u => u._id === userId ? { ...u, accountStatus: newStatus } : u));
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    
    return matchSearch && matchRole;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user directory...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84464]/20 focus:border-[#f84464] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              {['ALL', 'customer', 'organiser'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterRole === role 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">User Details</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Joined</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                        user.role === 'organiser' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {(!user.accountStatus || user.accountStatus === 'ACTIVE') && (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                          </span>
                        )}
                        {user.accountStatus === 'SUSPENDED' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                            <ShieldAlert className="w-3.5 h-3.5" /> SUSPENDED
                          </span>
                        )}
                        {user.accountStatus === 'BANNED' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                            <ShieldBan className="w-3.5 h-3.5" /> BANNED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(!user.accountStatus || user.accountStatus === 'ACTIVE') ? (
                          <>
                            <button 
                              onClick={() => updateAccountStatus(user._id, 'SUSPENDED')}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Suspend User"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateAccountStatus(user._id, 'BANNED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Ban User"
                            >
                              <ShieldBan className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => updateAccountStatus(user._id, 'ACTIVE')}
                            className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            Restore Access
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
