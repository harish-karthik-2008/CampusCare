"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  ChevronRight,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Check,
  Sparkles,
  AlertOctagon,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { formatTimeAgo, formatDate } from "@/lib/utils";

const TEAMS = [
  "IT Team",
  "Maintenance Team",
  "Electrical Team",
  "Plumbing Team",
  "Hostel Team",
  "Transport Team",
  "Mess Team",
  "Security Team",
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Modal states for Quick Actions
  const [activeAssignComplaint, setActiveAssignComplaint] = useState<any | null>(null);
  const [assignTeam, setAssignTeam] = useState(TEAMS[0]);
  const [assignNote, setAssignNote] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const [activeResolveComplaint, setActiveResolveComplaint] = useState<any | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
  }, [selectedStatus, selectedCategory, selectedPriority, selectedTeam, overdueOnly]);

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
      if (selectedTeam !== "ALL") params.append("team", selectedTeam);
      if (searchTerm) params.append("search", searchTerm);
      if (overdueOnly) params.append("overdue", "true");

      const res = await fetch(`/api/admin/complaints?${params.toString()}`);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setSelectedCategory("ALL");
    setSelectedPriority("ALL");
    setSelectedTeam("ALL");
    setOverdueOnly(false);
  };

  // Submit Quick Assign
  async function submitAssignment() {
    if (!activeAssignComplaint) return;
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/admin/complaints/${activeAssignComplaint.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTeam: assignTeam, note: assignNote }),
      });
      if (res.ok) {
        setActiveAssignComplaint(null);
        setAssignNote("");
        await fetchComplaints();
      }
    } catch {
      alert("Failed to assign team");
    } finally {
      setIsAssigning(false);
    }
  }

  // Submit Quick Resolve
  async function submitResolution() {
    if (!activeResolveComplaint) return;
    if (!resolutionNote.trim() || resolutionNote.trim().length < 5) {
      setResolveError("Resolution note is required (minimum 5 characters).");
      return;
    }
    setIsResolving(true);
    setResolveError(null);
    try {
      const res = await fetch(`/api/admin/complaints/${activeResolveComplaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RESOLVED",
          resolutionNote: resolutionNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to mark as resolved");
      }
      setActiveResolveComplaint(null);
      setResolutionNote("");
      await fetchComplaints();
    } catch (err: any) {
      setResolveError(err.message);
    } finally {
      setIsResolving(false);
    }
  }

  const hasActiveFilters =
    selectedStatus !== "ALL" ||
    selectedCategory !== "ALL" ||
    selectedPriority !== "ALL" ||
    selectedTeam !== "ALL" ||
    overdueOnly ||
    searchTerm.length > 0;

  // Status Tab List
  const statusTabs = [
    { key: "ALL", label: "All Tickets" },
    { key: "PENDING", label: "Pending" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
    { key: "CLOSED", label: "Closed" },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header with Gradient Accent */}
      <div className="bg-gradient-to-r from-white via-white to-purple-50/40 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 mb-2">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Central Campus Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complaints Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Triage, assign maintenance squads, manage SLA compliance, and document resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/analytics"
            prefetch={true}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            Analytics View
          </Link>
        </div>
      </div>

      {/* 1-Click Status Pill Tabs */}
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
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ticket #, title, student name, department, or location..."
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

        {/* Filters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-campus w-full px-2 py-1.5 font-medium"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-campus w-full px-2 py-1.5 font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="NORMAL">Normal (72h)</option>
              <option value="HIGH">High (48h)</option>
              <option value="CRITICAL">Critical (24h)</option>
            </select>
          </div>

          {/* Assigned Team */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Assigned Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="input-campus w-full px-2 py-1.5 font-medium"
            >
              <option value="ALL">All Teams</option>
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Overdue Checkbox & Clear */}
          <div className="flex flex-col justify-end space-y-1">
            <label className="flex items-center gap-1.5 text-xs text-rose-700 font-bold cursor-pointer pb-1">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => setOverdueOnly(e.target.checked)}
                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Overdue SLA Only</span>
            </label>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 text-left"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
            Loading management database...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="text-base font-bold text-slate-800">No complaints found</p>
            <p className="text-xs text-slate-400">Try adjusting your filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issue Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">SLA Window</th>
                  <th className="py-3 px-4 text-right">Actions</th>
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
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{item.student.name}</p>
                      <p className="text-[10px] text-slate-400">{item.student.department}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">
                      <Link
                        href={`/admin/complaints/${item.id}`}
                        prefetch={true}
                        className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate block"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {item.locationBuilding}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.assignedTeam ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                          {item.assignedTeam}
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveAssignComplaint(item)}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          + Assign
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <SLAIndicator
                        createdAt={item.createdAt}
                        priority={item.priority}
                        status={item.status}
                        resolvedAt={item.resolvedAt}
                        compact
                      />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      {item.status !== "RESOLVED" && item.status !== "CLOSED" && (
                        <button
                          onClick={() => {
                            setActiveResolveComplaint(item);
                            setResolutionNote("");
                            setResolveError(null);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                      <Link
                        href={`/admin/complaints/${item.id}`}
                        prefetch={true}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 transition-colors"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK ASSIGN MODAL */}
      {activeAssignComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Assign Technical Group
              </h3>
              <button
                onClick={() => setActiveAssignComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Assign complaint <strong>{activeAssignComplaint.complaintNumber}</strong> (&quot;{activeAssignComplaint.title}&quot;) to a maintenance or IT team. Status will transition to <strong>IN PROGRESS</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsible Team
                </label>
                <select
                  value={assignTeam}
                  onChange={(e) => setAssignTeam(e.target.value)}
                  className="input-campus w-full px-3 py-2 text-xs font-semibold"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dispatch Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  placeholder="e.g. Inspect router on floor 3; verify SSID broadcast"
                  className="input-campus w-full px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveAssignComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={submitAssignment}
                disabled={isAssigning}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK RESOLVE MODAL (MANDATORY RESOLUTION NOTE) */}
      {activeResolveComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Mark Issue as Resolved</h3>
              </div>
              <button
                onClick={() => setActiveResolveComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are marking <strong>{activeResolveComplaint.complaintNumber}</strong> as fixed.
              A detailed resolution note is <strong>mandatory</strong> so the reporting student can verify the repair.
            </p>

            {resolveError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {resolveError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resolution Note <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Explain the technical remedy (e.g. Access point restarted and channel switch completed; tested signal in rooms 301-320)."
                className="input-campus w-full px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveResolveComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={submitResolution}
                disabled={isResolving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
              >
                {isResolving ? "Saving..." : "Mark as Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
