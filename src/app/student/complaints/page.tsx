"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { formatTimeAgo, formatDate } from "@/lib/utils";

interface ComplaintItem {
  id: string;
  complaintNumber: string;
  title: string;
  description: string;
  locationBuilding: string;
  locationBlock?: string | null;
  locationRoom?: string | null;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  category: {
    id: string;
    name: string;
  };
  assignedAdmin?: {
    name: string;
  } | null;
}

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
  }, [selectedStatus, selectedCategory, selectedPriority]);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {}
  }

  async function fetchComplaints() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (selectedPriority !== "ALL") params.append("priority", selectedPriority);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`/api/complaints?${params.toString()}`);
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setSelectedCategory("ALL");
    setSelectedPriority("ALL");
  };

  const hasActiveFilters =
    selectedStatus !== "ALL" ||
    selectedCategory !== "ALL" ||
    selectedPriority !== "ALL" ||
    searchTerm.length > 0;

  // Status Tab List
  const statusTabs = [
    { key: "ALL", label: "All Tickets" },
    { key: "PENDING", label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { key: "IN_PROGRESS", label: "In Progress", color: "text-blue-700 bg-blue-50 border-blue-200" },
    { key: "RESOLVED", label: "Resolved", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { key: "CLOSED", label: "Closed", color: "text-slate-600 bg-slate-100 border-slate-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Area with subtle gradient card */}
      <div className="bg-gradient-to-r from-white via-white to-purple-50/40 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 mb-2">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Track & Monitor
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time repair progress, view technician updates, and confirm completed tickets.
          </p>
        </div>

        <Link
          href="/student/complaints/new"
          prefetch={true}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Instant Status Pill Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket ID (e.g. CC-1001), keyword, or location..."
              className="input-campus w-full pl-9 pr-3 py-2 text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category & Priority Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-campus w-full px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-campus w-full px-2.5 py-1.5 font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="NORMAL">Normal (72h)</option>
              <option value="HIGH">High (48h)</option>
              <option value="CRITICAL">Critical (24h)</option>
            </select>
          </div>

          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
            Filtering tickets...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-800">
              No complaints found
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No tickets matched your filter selections. Try clearing filters or submit a new concern.
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/student/complaints/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
              >
                + Submit Complaint
              </Link>
            )}
          </div>
        ) : (
          <div>
            {/* MOBILE CARDS VIEW (< sm) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {complaints.map((item) => (
                <div key={item.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-xs">
                      {item.complaintNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={item.priority} showIcon={false} />
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/student/complaints/${item.id}`}
                      prefetch={true}
                      className="font-bold text-sm text-slate-900 hover:text-purple-600 transition-colors block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {item.category.name}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.locationBuilding}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <SLAIndicator
                      createdAt={item.createdAt}
                      priority={item.priority}
                      status={item.status}
                      resolvedAt={item.resolvedAt}
                      compact
                    />
                    <Link
                      href={`/student/complaints/${item.id}`}
                      prefetch={true}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP & TABLET DATA TABLE (sm:) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Issue Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Campus Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">SLA Clock</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {complaints.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-xs">
                          {item.complaintNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          href={`/student/complaints/${item.id}`}
                          prefetch={true}
                          className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {item.category.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {item.locationBuilding}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} showIcon={false} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SLAIndicator
                          createdAt={item.createdAt}
                          priority={item.priority}
                          status={item.status}
                          resolvedAt={item.resolvedAt}
                          compact
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/student/complaints/${item.id}`}
                          prefetch={true}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all border border-purple-200/60"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
