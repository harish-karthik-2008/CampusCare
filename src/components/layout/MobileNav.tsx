"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isMain?: boolean;
}

export function MobileNav({ role }: { role: "STUDENT" | "ADMIN" }) {
  const pathname = usePathname();

  const studentLinks: NavLink[] = [
    { label: "Home", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Issues", href: "/student/complaints", icon: FileText },
    { label: "New", href: "/student/complaints/new", icon: PlusCircle, isMain: true },
    { label: "Alerts", href: "/student/notifications", icon: Bell },
    { label: "Profile", href: "/student/profile", icon: User },
  ];

  const adminLinks: NavLink[] = [
    { label: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage", href: "/admin/complaints", icon: FileText },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Alerts", href: "/admin/notifications", icon: Bell },
    { label: "Profile", href: "/admin/profile", icon: User },
  ];

  const links = role === "ADMIN" ? adminLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 md:hidden py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isMain) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 border-2 border-white">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-purple-700 mt-0.5">
                  {link.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-semibold transition-colors",
                isActive ? "text-purple-600 font-bold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-purple-600" : "text-slate-400")} />
              <span className="text-[10px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
