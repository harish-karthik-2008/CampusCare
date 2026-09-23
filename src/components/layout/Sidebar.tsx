"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  BarChart3,
  Users,
  Tags,
  ChevronRight,
  X,
  LogOut,
  Sparkles,
  CheckCircle,
  Shield,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSession } from "@/lib/auth";

interface SidebarProps {
  role: "STUDENT" | "ADMIN";
  user: UserSession;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const studentNav = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Complaints", href: "/student/complaints", icon: FileText },
    { label: "New Complaint", href: "/student/complaints/new", icon: PlusCircle, isHighlight: true },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
    { label: "My Profile", href: "/student/profile", icon: User },
  ];

  const adminNav = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "All Complaints", href: "/admin/complaints", icon: FileText },
    { label: "Campus Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "User Directory", href: "/admin/users", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings & Profile", href: "/admin/profile", icon: User },
  ];

  const navItems = role === "ADMIN" ? adminNav : studentNav;

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
      onClose();
      if (targetRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    }
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 w-64 h-screen z-40 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* TOP HEADER: BRAND LOGO */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <Link
            href={role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"}
            prefetch={true}
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-0.5">
              <Image
                src="/campuscare-logo.png"
                alt="CampusCare Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                  Campus<span className="text-purple-600">Care</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Campus Resolution System
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MIDDLE SECTION: QUICK ACTION & NAVIGATION */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {/* Quick Action Button */}
          {role === "STUDENT" ? (
            <Link
              href="/student/complaints/new"
              prefetch={true}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:shadow-purple-500/30 transform active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Issue</span>
            </Link>
          ) : (
            <Link
              href="/admin/complaints?status=PENDING"
              prefetch={true}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-all transform active:scale-[0.98]"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Review Priority Queue</span>
            </Link>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {role === "ADMIN" ? "Management Suite" : "Student Portal"}
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/student/dashboard" &&
                  item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group duration-150",
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-purple-600"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-purple-200" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: USER PROFILE & ACTIONS */}
      <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {/* Quick Demo Switcher inside Sidebar */}
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200/70"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Switch Demo Role</span>
            </div>
            <span className="text-[10px] text-purple-500 font-bold">⇄</span>
          </button>

          {showDemoMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Instant Demo Switch
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
                {role === "STUDENT" && <CheckCircle className="w-4 h-4 text-purple-600" />}
              </button>
              <button
                onClick={() => switchDemoUser("ADMIN")}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">Admin Portal</p>
                  <p className="text-[10px] text-slate-400">admin@campuscare.demo</p>
                </div>
                {role === "ADMIN" && <CheckCircle className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 shrink-0 flex items-center justify-center font-bold text-xs text-purple-700">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {user.department || user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
