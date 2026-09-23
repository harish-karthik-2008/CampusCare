"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  BarChart3,
  Users,
  Tags,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "STUDENT" | "ADMIN";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

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

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden md:flex shadow-2xs">
      <div className="space-y-6">
        {/* Student Quick Action Button */}
        {role === "STUDENT" && (
          <div className="px-1">
            <Link
              href="/student/complaints/new"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:shadow-purple-500/30 transform active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Issue</span>
            </Link>
          </div>
        )}

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group duration-150",
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

      {/* Campus Tagline Card */}
      <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
        <p className="text-xs font-bold text-purple-900">CampusCare BIT</p>
        <p className="text-[11px] text-purple-700/80 mt-0.5">
          &ldquo;Smarter Complaints. Better Campus.&rdquo;
        </p>
      </div>
    </aside>
  );
}
