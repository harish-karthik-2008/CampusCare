"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  Layers,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  complaintId?: string | null;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  department?: string | null;
  avatar?: string | null;
}

export function Navbar({ user }: { user: UserSession }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function switchDemoUser(targetRole: "STUDENT" | "ADMIN") {
    setShowDemoMenu(false);
    const email =
      targetRole === "STUDENT"
        ? "student@campuscare.demo"
        : "admin@campuscare.demo";
    const password = targetRole === "STUDENT" ? "student123" : "admin123";

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      if (targetRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link
            href={user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"}
            prefetch={true}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-0.5">
              <Image
                src="/campuscare-logo.png"
                alt="CampusCare Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                  Campus<span className="text-purple-600">Care</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {user.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Smart Campus Resolution System
              </p>
            </div>
          </Link>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200/70"
                title="Switch demo account"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-purple-600" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Quick Login
                    </p>
                  </div>
                  <button
                    onClick={() => switchDemoUser("STUDENT")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Student Portal</p>
                      <p className="text-[10px] text-slate-400">student@campuscare.demo</p>
                    </div>
                    {user.role === "STUDENT" && <CheckCircle className="w-4 h-4 text-purple-600" />}
                  </button>
                  <button
                    onClick={() => switchDemoUser("ADMIN")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">Admin Portal</p>
                      <p className="text-[10px] text-slate-400">admin@campuscare.demo</p>
                    </div>
                    {user.role === "ADMIN" && <CheckCircle className="w-4 h-4 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu) markAllAsRead();
                }}
                className="relative p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-[480px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">You&apos;re up to date! No notifications.</p>
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3.5 hover:bg-slate-50 transition-colors flex gap-3 ${
                            !notif.isRead ? "bg-purple-50/40" : ""
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                    <Link
                      href={user.role === "ADMIN" ? "/admin/notifications" : "/student/notifications"}
                      onClick={() => setShowNotifMenu(false)}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-700">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden md:block max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.department && (
                      <p className="text-[10px] text-purple-600 font-medium mt-0.5 truncate">
                        {user.department}
                      </p>
                    )}
                  </div>

                  <Link
                    href={user.role === "ADMIN" ? "/admin/profile" : "/student/profile"}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Profile & Settings
                  </Link>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
