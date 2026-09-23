"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { UserSession } from "@/lib/auth";

interface AppShellProps {
  user: UserSession;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically close mobile sidebar drawer whenever route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-campus-bg flex flex-col text-campus-text">
      {/* 1. FIXED LEFT SIDEBAR NAVBAR */}
      <Sidebar
        role={user.role}
        user={user}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 2. FIXED TOP HEADER */}
      <Navbar
        user={user}
        onMenuToggle={() => setIsMobileOpen((prev) => !prev)}
        isMobileOpen={isMobileOpen}
      />

      {/* 3. RESPONSIVE MAIN SCROLLABLE CONTENT AREA */}
      <div className="md:pl-64 pt-16 flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 min-w-0">
          {children}
        </main>
      </div>

      {/* 4. MOBILE BOTTOM 1-THUMB NAVIGATION BAR */}
      <MobileNav role={user.role} />
    </div>
  );
}
