"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roleParam === "admin") {
      setEmail("admin@campuscare.demo");
      setPassword("admin123");
    } else {
      setEmail("student@campuscare.demo");
      setPassword("student123");
    }
  }, [roleParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your credentials.");
      setIsLoading(false);
    }
  }

  function handleDemoSelect(role: "student" | "admin") {
    setError(null);
    if (role === "student") {
      setEmail("student@campuscare.demo");
      setPassword("student123");
    } else {
      setEmail("admin@campuscare.demo");
      setPassword("admin123");
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Access the student issue reporting portal or administrative console.
        </p>
      </div>

      {/* Demo Fast Login Pills */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Demo Quick-Fill
          </span>
          <span className="text-[10px] text-purple-600 font-medium">1-Click credentials</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoSelect("student")}
            className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
              email.includes("student")
                ? "bg-white border-purple-400 text-purple-700 shadow-2xs"
                : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-bold leading-tight">Student</p>
              <p className="text-[10px] text-slate-400 truncate">student@demo</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect("admin")}
            className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
              email.includes("admin")
                ? "bg-white border-purple-400 text-purple-700 shadow-2xs"
                : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-bold leading-tight">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">admin@demo</p>
            </div>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campuscare.demo"
              className="input-campus w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert("For demo purposes, default password is 'student123' or 'admin123'")}
              className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-campus w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Remember this session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Sign In to CampusCare</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        <p>Bannari Amman Institute of Technology</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-campus-bg flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center p-1">
            <Image
              src="/campuscare-logo.png"
              alt="CampusCare Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight block">
              Campus<span className="text-purple-600">Care</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              &ldquo;Smarter Complaints. Better Campus.&rdquo;
            </span>
          </div>
        </Link>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-xs">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
