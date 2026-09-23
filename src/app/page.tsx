"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users2,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const steps = [
    {
      num: "01",
      title: "Report Issue",
      desc: "Describe the problem, pick the department, specify the campus location, and attach photos.",
      icon: Zap,
    },
    {
      num: "02",
      title: "Admin Review",
      desc: "Campus administrators review, prioritize by urgency, and assign dedicated maintenance or IT teams.",
      icon: ShieldCheck,
    },
    {
      num: "03",
      title: "Fast Resolution",
      desc: "Technicians fix the problem on-site and document transparent resolution notes with timestamps.",
      icon: CheckCircle2,
    },
    {
      num: "04",
      title: "Student Verification",
      desc: "Students verify resolution, close the ticket, or report if the issue persists with 1-5 star feedback.",
      icon: Clock,
    },
  ];

  const features = [
    {
      title: "Easy Complaint Submission",
      desc: "Intuitive multi-step form with category classification, exact block/room location, and photo upload.",
      icon: Layers,
    },
    {
      title: "Real-Time Status Tracking",
      desc: "Transparent visual timeline keeping students informed from submission to final resolution.",
      icon: Clock,
    },
    {
      title: "Smart Priority & SLA",
      desc: "Automated SLA tracking (24h Critical, 48h High, 72h Normal) with proactive overdue escalations.",
      icon: AlertTriangle,
    },
    {
      title: "Dedicated Team Assignment",
      desc: "Route complaints directly to IT, Electrical, Plumbing, Hostel, Transport, or Mess departments.",
      icon: Building2,
    },
    {
      title: "Executive Admin Dashboard",
      desc: "Centralized command center for campus authorities to filter, prioritize, and manage all requests.",
      icon: Users2,
    },
    {
      title: "Campus-Wide Analytics",
      desc: "Visual charts, resolution velocity metrics, and student satisfaction feedback trends.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-campus-bg text-campus-text flex flex-col selection:bg-purple-200">
      {/* Top Brand Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center p-0.5">
                <Image
                  src="/campuscare-logo.png"
                  alt="CampusCare Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Campus<span className="text-purple-600">Care</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Stay Ahead
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#how-it-works" className="hover:text-purple-600 transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-purple-600 transition-colors">
                Features
              </a>
              <a href="#impact" className="hover:text-purple-600 transition-colors">
                Campus Impact
              </a>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href="/login?role=admin"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-purple-600 transition-colors"
              >
                Admin Login
              </Link>
              <Link
                href="/login?role=student"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold tracking-wide border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Next-Generation Campus Operations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                A Better Way to Care for Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Campus
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                CampusCare helps students report campus issues, track progress in real-time, and stay informed, while administrators manage, assign, and resolve complaints with transparency.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/login?role=student"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Report a Complaint</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login?role=admin"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
                >
                  <span>Explore Admin Portal</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Tagline Badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Report it.
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Track it.
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  Resolve it.
                </span>
              </div>
            </div>

            {/* Right Product Preview UI Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/90 space-y-4">
                {/* Header card snippet */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                      CC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Live Complaint Monitor</p>
                      <p className="text-[10px] text-slate-400">Hostel & IT Operations</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Sample Complaint Card 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700">#CC-1001</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      IN PROGRESS
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Wi-Fi not working in Hostel Block B
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Assigned to: <span className="font-medium text-slate-700">IT Team</span> • 3rd Floor
                  </p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-2/3 rounded-full" />
                  </div>
                </div>

                {/* Sample Complaint Card 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-700">#CC-1002</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      RESOLVED
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Bathroom pipe leaking in Kaveri Hostel
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Plumber replaced PVC elbow joint • Ready for student check
                  </p>
                </div>

                {/* Metric Quick Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                    <p className="text-base font-extrabold text-purple-700">94%</p>
                    <p className="text-[9px] text-purple-900 font-semibold uppercase">Resolution</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-base font-extrabold text-blue-700">&lt;18h</p>
                    <p className="text-[9px] text-blue-900 font-semibold uppercase">Turnaround</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <p className="text-base font-extrabold text-emerald-700">4.8★</p>
                    <p className="text-[9px] text-emerald-900 font-semibold uppercase">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How CampusCare Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A transparent, closed-loop workflow ensuring every reported concern is systematically investigated, solved, and student-verified.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-2xl bg-campus-bg/40 border border-slate-200/80 transition-card group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 group-hover:text-purple-400 transition-colors">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-campus-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
              Built for Scale
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Powerful Features for Students & Staff
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Designed specifically for modern engineering colleges, universities, and residential campuses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs transition-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section id="impact" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-purple-600">94%</p>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Complaints Resolved</p>
              <p className="text-xs text-slate-400">Within target SLA window</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-slate-900">&lt;18h</p>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Average Turnaround</p>
              <p className="text-xs text-slate-400">From filing to assignment</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-purple-600">10+</p>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Campus Departments</p>
              <p className="text-xs text-slate-400">IT, Hostel, Electrical, Mess</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl font-black text-emerald-600">4.8 / 5</p>
              <p className="text-xs sm:text-sm font-bold text-slate-800">Student Satisfaction</p>
              <p className="text-xs text-slate-400">Based on verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Make Your Campus Better — One Issue at a Time.
          </h2>
          <p className="text-purple-200 text-sm sm:text-base max-w-xl mx-auto">
            Experience the new standard in student support and campus facility management.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-purple-900 bg-white hover:bg-slate-100 shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
              <Image
                src="/campuscare-logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-white text-sm">CampusCare</p>
              <p className="text-[11px] text-slate-400">&ldquo;Smarter Complaints. Better Campus.&rdquo;</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link href="/login?role=student" className="hover:text-white transition-colors">
              Student Portal
            </Link>
            <Link href="/login?role=admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} CampusCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
