"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Star,
  FileText,
  AlertOctagon,
  MessageSquare,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { ComplaintTimeline } from "@/components/complaints/ComplaintTimeline";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function StudentComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolution confirmation action states
  const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmResolution(action: "CONFIRM" | "REOPEN") {
    setIsSubmittingConfirm(true);
    try {
      const res = await fetch(`/api/complaints/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      await fetchComplaint();
    } catch (err: any) {
      alert(err.message || "Failed to submit resolution verification");
    } finally {
      setIsSubmittingConfirm(false);
    }
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/complaints/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: feedbackComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Feedback failed");
      setFeedbackSuccess(true);
      await fetchComplaint();
    } catch (err: any) {
      alert(err.message || "Could not submit feedback");
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-3" />
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">{error || "Could not retrieve ticket records."}</p>
        <Link
          href="/student/complaints"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>
      </div>
    );
  }

  const isResolved = complaint.status === "RESOLVED";
  const isClosed = complaint.status === "CLOSED";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/complaints"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          Last updated: {formatTimeAgo(complaint.updatedAt)}
        </span>
      </div>

      {/* Main Header Card */}
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
            Submitted on {formatDate(complaint.createdAt)}
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
            <span className="font-semibold text-slate-400">Department:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
              {complaint.category.name}
            </span>
          </span>

          {complaint.assignedTeam && (
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">Assigned Team:</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                {complaint.assignedTeam}
              </span>
            </span>
          )}
        </div>

        {/* SLA Progress Bar */}
        <div className="pt-2">
          <SLAIndicator
            createdAt={complaint.createdAt}
            priority={complaint.priority}
            status={complaint.status}
            resolvedAt={complaint.resolvedAt}
          />
        </div>
      </div>

      {/* Description & Attachment Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Problem Description
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {complaint.description}
          </p>

          {/* Attachment if present */}
          {complaint.attachmentUrl && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-600">Attached Evidence</h4>
              {complaint.attachmentUrl.startsWith("data:image") ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100 flex items-center justify-center">
                  <img
                    src={complaint.attachmentUrl}
                    alt="Evidence"
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
                  View Document Attachment
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ticket Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400">Reporter</p>
              <p className="font-semibold text-slate-900 mt-0.5">{complaint.student.name}</p>
              <p className="text-slate-500 text-[11px]">{complaint.student.department}</p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-slate-400">Assigned In-Charge</p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {complaint.assignedAdmin?.name || "Pending Administrator Assignment"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-slate-400">Assigned Technical Group</p>
              <p className="font-semibold text-purple-700 mt-0.5">
                {complaint.assignedTeam || "Awaiting Review"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION SECTION: Verification & Rating Actions */}
      {isResolved && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-200 text-emerald-800 uppercase tracking-wider">
                Action Required
              </span>
              <h2 className="text-lg font-extrabold text-emerald-950 mt-1">
                Your Issue Has Been Marked As Resolved!
              </h2>
              <p className="text-xs text-emerald-800/90 mt-1">
                The maintenance team has recorded completion of this work. Please test/verify on campus and confirm whether the problem is fixed.
              </p>
            </div>
          </div>

          {/* Official Resolution Note */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-1">
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Technician Resolution Summary
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              &ldquo;{complaint.resolutionNote || "Issue inspected and resolved according to standard campus safety protocols."}&rdquo;
            </p>
            {complaint.resolvedAt && (
              <p className="text-[10px] text-slate-400 pt-1">
                Resolved on {formatDate(complaint.resolvedAt)}
              </p>
            )}
          </div>

          {/* Confirm or Reopen buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => handleConfirmResolution("CONFIRM")}
              disabled={isSubmittingConfirm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Resolution (Close Ticket)</span>
            </button>

            <button
              onClick={() => handleConfirmResolution("REOPEN")}
              disabled={isSubmittingConfirm}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-red-700 bg-red-100/70 hover:bg-red-200/80 border border-red-200 transition-all flex items-center justify-center gap-2"
            >
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>Report Issue Still Exists</span>
            </button>
          </div>
        </div>
      )}

      {/* CLOSED CONFIRMATION & FEEDBACK */}
      {isClosed && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-3 text-emerald-700">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaint Closed & Verified</h3>
              <p className="text-xs text-slate-500">
                Closed on {formatDate(complaint.closedAt || complaint.updatedAt)}
              </p>
            </div>
          </div>

          {complaint.feedback ? (
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">Your Submitted Feedback</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= complaint.feedback.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {complaint.feedback.comment && (
                <p className="text-xs text-slate-700 italic">
                  &ldquo;{complaint.feedback.comment}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  How satisfied are you with the resolution turnaround?
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Optional review: Was the technician polite and prompt?"
                  className="input-campus w-full px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      )}

      {/* Dynamic Status Timeline Audit */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Live Status Timeline</h3>
          <p className="text-xs text-slate-400">
            Real-time stage transitions and administrative update logs
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
  );
}
