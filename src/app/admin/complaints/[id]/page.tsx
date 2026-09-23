"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  Send,
  AlertOctagon,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { ComplaintTimeline } from "@/components/complaints/ComplaintTimeline";
import { formatDate, formatTimeAgo } from "@/lib/utils";

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

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for updates
  const [assignedTeam, setAssignedTeam] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  async function fetchComplaint() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/complaints/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Complaint not found");
      setComplaint(data.complaint);
      setAssignedTeam(data.complaint.assignedTeam || TEAMS[0]);
      setStatus(data.complaint.status);
      setPriority(data.complaint.priority);
      setResolutionNote(data.complaint.resolutionNote || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssignTeam() {
    setIsUpdating(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/complaints/${id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTeam, note: internalNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assignment failed");
      setUpdateSuccess(true);
      setInternalNote("");
      setTimeout(() => setUpdateSuccess(false), 2000);
      await fetchComplaint();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleStatusChange() {
    setIsUpdating(true);
    setActionError(null);

    // Enforcement: If marking RESOLVED, resolution note is mandatory!
    if (status === "RESOLVED" && (!resolutionNote.trim() || resolutionNote.trim().length < 5)) {
      setActionError("A resolution note (minimum 5 characters) is required when marking as RESOLVED.");
      setIsUpdating(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          resolutionNote: status === "RESOLVED" ? resolutionNote.trim() : undefined,
          internalNote: internalNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed");

      setUpdateSuccess(true);
      setInternalNote("");
      setTimeout(() => setUpdateSuccess(false), 2000);
      await fetchComplaint();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
        Loading complaint records...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Record Not Found</h2>
        <p className="text-xs text-slate-500">{error || "Could not retrieve ticket details."}</p>
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints Management
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Last updated: {formatTimeAgo(complaint.updatedAt)}
        </span>
      </div>

      {updateSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Complaint updated and synchronized across student portal successfully.</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Ticket Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              {complaint.complaintNumber}
            </span>
            <StatusBadge status={complaint.status} size="md" />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <div className="text-xs text-slate-400">
            Received on {formatDate(complaint.createdAt)}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {complaint.title}
        </h1>

        {/* Location & Metadata Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 pb-2 text-xs text-slate-600 border-t border-b border-slate-100">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <strong className="text-slate-800">{complaint.locationBuilding}</strong>
            {complaint.locationBlock && ` • ${complaint.locationBlock}`}
            {complaint.locationRoom && ` (${complaint.locationRoom})`}
          </span>

          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Category:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
              {complaint.category.name}
            </span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Current Assignee:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
              {complaint.assignedTeam || "Unassigned"}
            </span>
          </span>
        </div>

        {/* Target SLA */}
        <div className="pt-2">
          <SLAIndicator
            createdAt={complaint.createdAt}
            priority={complaint.priority}
            status={complaint.status}
            resolvedAt={complaint.resolvedAt}
          />
        </div>
      </div>

      {/* Grid: Description & Admin Action Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Description & Student Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Student Statement & Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {complaint.description}
            </p>

            {complaint.attachmentUrl && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-600">Attached Student Evidence</h4>
                {complaint.attachmentUrl.startsWith("data:image") ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100 flex items-center justify-center">
                    <img
                      src={complaint.attachmentUrl}
                      alt="Student evidence"
                      className="max-h-72 w-full object-contain"
                    />
                  </div>
                ) : (
                  <a
                    href={complaint.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    Open Uploaded Document
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Reporting Student Information
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-900">{complaint.student.name}</p>
                  <p className="text-slate-400 text-[10px]">Student Name</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800">{complaint.student.email}</p>
                  <p className="text-slate-400 text-[10px]">Email Address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800">{complaint.student.department}</p>
                  <p className="text-slate-400 text-[10px]">Department</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Audit Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Official Status Audit Trail</h3>
              <p className="text-xs text-slate-400">
                Timeline of updates, team dispatches, and student verification actions
              </p>
            </div>
            <ComplaintTimeline
              logs={complaint.resolutionLogs || []}
              currentStatus={complaint.status}
              createdAt={complaint.createdAt}
              resolvedAt={complaint.resolvedAt}
              closedAt={complaint.closedAt}
            />
          </div>
        </div>

        {/* Right: Administrative Control Console */}
        <div className="space-y-6">
          {/* Action Console Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Management Actions
              </h3>
            </div>

            {/* Team Assignment */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Assign Technical Group
              </label>
              <div className="flex gap-2">
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="input-campus flex-1 px-3 py-2 text-xs font-medium"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssignTeam}
                  disabled={isUpdating}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Status Transition */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Update Resolution Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-campus w-full px-3 py-2 text-xs font-bold"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED (Requires note)</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Mandatory Resolution Note when status = RESOLVED */}
            {status === "RESOLVED" && (
              <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <label className="block text-xs font-bold text-emerald-900">
                  Technician Resolution Note <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Mandatory: Detail what repair was completed, parts replaced, or corrective measures taken."
                  className="input-campus w-full px-2.5 py-1.5 text-xs bg-white"
                />
              </div>
            )}

            {/* Priority Adjustment */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-campus w-full px-3 py-2 text-xs font-medium"
              >
                <option value="NORMAL">NORMAL (72 Hours)</option>
                <option value="HIGH">HIGH (48 Hours)</option>
                <option value="CRITICAL">CRITICAL (24 Hours)</option>
              </select>
            </div>

            {/* Internal remarks */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Audit Remark / Internal Note
              </label>
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="e.g. Technician dispatched on-site; awaiting replacement valve"
                className="input-campus w-full px-3 py-2 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleStatusChange}
              disabled={isUpdating}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Save Status & Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
