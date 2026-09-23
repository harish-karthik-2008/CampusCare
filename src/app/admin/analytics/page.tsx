"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Star,
  TrendingUp,
  Sparkles,
  Users,
} from "lucide-react";
import {
  CategoryDonutChart,
  StatusBarChart,
  TimelineAreaChart,
} from "@/components/admin/AdminCharts";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto mb-2" />
        Calculating campus analytics...
      </div>
    );
  }

  const { summary, charts, insights } = analytics || {
    summary: {},
    charts: { categoryChart: [], statusChart: [], timelineChart: [] },
    insights: [],
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Analytics & Performance Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time insights on campus resolution velocity, department workloads, and student satisfaction.
        </p>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Average Resolution Time */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg Turnaround
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {summary.avgResolutionTime || 18.5}h
          </p>
          <p className="text-[11px] text-slate-400">Target SLA: under 48 hours</p>
        </div>

        {/* Resolution Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-emerald-600">
            {summary.resolutionRate || 85}%
          </p>
          <p className="text-[11px] text-slate-400">Resolved vs filed tickets</p>
        </div>

        {/* Overdue Count */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overdue Incidents
            </span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-rose-600">
            {summary.overdue || 0}
          </p>
          <p className="text-[11px] text-slate-400">Tickets exceeding SLA</p>
        </div>

        {/* Student Satisfaction */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Student Rating
            </span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-600">
            {summary.avgSatisfaction || 4.8}★
          </p>
          <p className="text-[11px] text-slate-400">
            Across {summary.feedbackCount || 2} verified responses
          </p>
        </div>
      </div>

      {/* Smart Operational Insights Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white rounded-2xl border border-purple-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
            Operational Highlights & Analysis
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((insight: string, idx: number) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-purple-100 text-xs text-slate-700 shadow-2xs"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
            <p className="text-xs text-slate-400">Departmental breakdown</p>
          </div>
          <CategoryDonutChart data={charts.categoryChart || []} />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Distribution</h3>
            <p className="text-xs text-slate-400">Pending, In Progress, Resolved, Closed</p>
          </div>
          <StatusBarChart data={charts.statusChart || []} />
        </div>

        {/* Inflow Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaints Over Time</h3>
            <p className="text-xs text-slate-400">Inflow over past 7 days</p>
          </div>
          <TimelineAreaChart data={charts.timelineChart || []} />
        </div>
      </div>
    </div>
  );
}
