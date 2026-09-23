"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Shield, User, Check, X, Building, Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const url = searchTerm ? `/api/admin/users?search=${encodeURIComponent(searchTerm)}` : "/api/admin/users";
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch {
      alert("Failed to update user status");
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Directory & Access Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View registered campus students, faculty coordinators, and active account status.
        </p>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user by name, email, or department..."
              className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
            Loading campus directory...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role === "ADMIN" ? (
                          <Shield className="w-3 h-3 text-purple-600" />
                        ) : (
                          <User className="w-3 h-3 text-slate-400" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {u.department || "General"}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {u._count?.complaints || 0} tickets filed
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => toggleUserStatus(u.id, u.isActive)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.isActive
                              ? "text-red-700 bg-red-50 hover:bg-red-100"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
