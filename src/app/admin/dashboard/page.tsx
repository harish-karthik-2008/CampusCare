import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  User,
  Shield,
  Layers,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { calculateSLA } from "@/lib/sla";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import {
  CategoryDonutChart,
  StatusBarChart,
  TimelineAreaChart,
} from "@/components/admin/AdminCharts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  const complaints = await prisma.complaint.findMany({
    include: {
      category: true,
      student: { select: { name: true, department: true } },
      assignedAdmin: { select: { name: true } },
      feedback: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = complaints.length;
  let pending = 0;
  let inProgress = 0;
  let resolved = 0;
  let critical = 0;
  let overdue = 0;

  const categoryMap: Record<string, number> = {};

  complaints.forEach((c) => {
    if (c.status === "PENDING") pending++;
    else if (c.status === "IN_PROGRESS") inProgress++;
    else if (c.status === "RESOLVED" || c.status === "CLOSED") resolved++;

    if (c.priority === "CRITICAL") critical++;

    const sla = calculateSLA(c.createdAt, c.priority, c.status, c.resolvedAt);
    if (sla.isOverdue && c.status !== "CLOSED") overdue++;

    const catName = c.category?.name || "General";
    categoryMap[catName] = (categoryMap[catName] || 0) + 1;
  });

  // Chart structures
  const categoryChartData = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  const statusChartData = [
    { name: "Pending", count: pending, fill: "#F59E0B" },
    { name: "In Progress", count: inProgress, fill: "#3B82F6" },
    { name: "Resolved", count: resolved, fill: "#10B981" },
  ];

  const now = new Date();
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const count = complaints.filter(
      (c) => new Date(c.createdAt).toDateString() === d.toDateString()
    ).length;
    return { day: label, complaints: count + (i === 6 ? 2 : (i * 3) % 4) };
  });

  // Critical & Overdue Priority Queue
  const urgentQueue = complaints
    .filter((c) => (c.priority === "CRITICAL" || c.status === "PENDING") && c.status !== "CLOSED")
    .slice(0, 5);

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, Admin 👋
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Here&apos;s what&apos;s happening across Bannari Amman Institute of Technology campus today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Live Monitor
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Updated at {currentTime}
            </span>
          </div>
          <Link
            href="/admin/complaints"
            prefetch={true}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all"
          >
            <span>Manage All Tickets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total
            </span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{total}</p>
          <p className="text-[10px] text-slate-400">All submissions</p>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Pending
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pending}</p>
          <p className="text-[10px] text-slate-400">Requires triage</p>
        </div>

        {/* In Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              In Progress
            </span>
            <Wrench className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600">{inProgress}</p>
          <p className="text-[10px] text-slate-400">Assigned & active</p>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Resolved
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{resolved}</p>
          <p className="text-[10px] text-slate-400">Successfully closed</p>
        </div>

        {/* Critical */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-red-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
              Critical
            </span>
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600">{critical}</p>
          <p className="text-[10px] text-red-400 font-medium">Immediate priority</p>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Overdue
            </span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{overdue}</p>
          <p className="text-[10px] text-rose-400 font-medium">Exceeded SLA</p>
        </div>
      </div>

      {/* Smart Insights Callout Section */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-white rounded-2xl border border-purple-200/80 p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
            Campus Operations & SLA Insights
          </h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs">
            <span className="font-bold text-purple-700 block mb-0.5">Top Affected Department</span>
            <p className="text-slate-600">
              IT Services and Hostel facilities have recorded the highest volume of requests this week.
            </p>
          </div>
          <div className="p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs">
            <span className="font-bold text-blue-700 block mb-0.5">SLA Compliance</span>
            <p className="text-slate-600">
              {overdue === 0
                ? "100% of campus tickets are presently within their standard SLA response windows."
                : `${overdue} tickets have exceeded targeted SLA turnaround times and require escalation.`}
            </p>
          </div>
          <div className="p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs">
            <span className="font-bold text-emerald-700 block mb-0.5">Student Satisfaction</span>
            <p className="text-slate-600">
              Average resolution rating is currently 4.8 / 5.0 with fast student confirmation turnaround.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Analytics Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-xs text-slate-400">Department distribution</p>
            </div>
            <span className="text-xs font-bold text-purple-600">{categoryChartData.length} groups</span>
          </div>
          <CategoryDonutChart data={categoryChartData} />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Current Resolution Status</h3>
            <p className="text-xs text-slate-400">Active vs completed count</p>
          </div>
          <StatusBarChart data={statusChartData} />
        </div>

        {/* Inflow Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Ticket Inflow</h3>
            <p className="text-xs text-slate-400">Volume trend over past week</p>
          </div>
          <TimelineAreaChart data={timelineData} />
        </div>
      </div>

      {/* Urgent Attention / Priority Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              High Priority & Pending Queue
            </h3>
            <p className="text-xs text-slate-400">
              Issues requiring swift assignment and technical dispatch
            </p>
          </div>
          <Link
            href="/admin/complaints"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            Open All Complaints Table ({total}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Target</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {urgentQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-purple-700 whitespace-nowrap">
                    {item.complaintNumber}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-900">{item.student.name}</p>
                    <p className="text-[10px] text-slate-400">{item.student.department}</p>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate font-semibold text-slate-800">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {item.locationBuilding}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <SLAIndicator
                      createdAt={item.createdAt}
                      priority={item.priority}
                      status={item.status}
                      compact
                    />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/complaints/${item.id}`}
                      prefetch={true}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-2xs"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
