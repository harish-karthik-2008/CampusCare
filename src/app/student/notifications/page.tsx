"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, FileText, ArrowRight } from "lucide-react";
import { formatTimeAgo, formatDate } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  complaintId?: string | null;
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stay informed on ticket assignments and status updates.</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">You&apos;re up to date!</p>
            <p className="text-xs text-slate-400">No active notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.isRead ? "bg-purple-50/30" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    !notif.isRead ? "bg-purple-600" : "bg-slate-300"
                  }`}
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{notif.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(notif.createdAt)} ({formatTimeAgo(notif.createdAt)})
                  </p>
                </div>
              </div>

              {notif.complaintId && (
                <Link
                  href={`/student/complaints/${notif.complaintId}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-100/60 shrink-0 inline-flex items-center gap-1 border border-purple-200/50"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
