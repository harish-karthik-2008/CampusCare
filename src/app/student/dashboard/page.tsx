import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SLAIndicator } from "@/components/ui/SLAIndicator";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import StudentCharts from "@/components/dashboard/StudentCharts";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  const complaints = await prisma.complaint.findMany({
    where: { studentId: user?.id },
    include: {
      category: true,
      assignedAdmin: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "PENDING").length;
  const inProgress = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolved = complaints.filter(
    (c) => c.status === "RESOLVED" || c.status === "CLOSED"
  ).length;

  const chartData = [
    { name: "Pending", value: pending, fill: "#F59E0B" },
    { name: "In Progress", value: inProgress, fill: "#3B82F6" },
    { name: "Resolved", value: resolved, fill: "#10B981" },
  ];

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Greeting Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name.split(" ")[0]} 👋
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track your campus concerns, monitor live resolution progress, and stay updated.
          </p>
        </div>

        <Link
          href="/student/complaints/new"
          prefetch={true}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Complaint</span>
        </Link>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Filed
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{total}</p>
          <p className="text-[11px] text-slate-400">Lifetime submissions</p>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{pending}</p>
          <p className="text-[11px] text-slate-400">Awaiting admin review</p>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-blue-600">{inProgress}</p>
          <p className="text-[11px] text-slate-400">Active team investigation</p>
        </div>

        {/* Resolved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{resolved}</p>
          <p className="text-[11px] text-slate-400">Fixed or closed</p>
        </div>
      </div>

      {/* Middle Grid: Status Overview Chart + Quick Action Banner */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaint Status Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of your reported concerns</p>
          </div>
          <div className="py-2">
            <StudentCharts data={chartData} />
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending ({pending})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress ({inProgress})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved ({resolved})
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
              Campus Facilities Service Desk
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Notice an issue with Wi-Fi, classroom equipment, or hostel facilities?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              CampusCare connects directly to dedicated maintenance supervisors across Bannari Amman Institute of Technology. Our standard response commitment is 24 hours for critical requests and 48 hours for general repairs.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Need immediate hostel warden assistance?</span>
            <Link
              href="/student/complaints/new"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Submit an urgent ticket →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
            <p className="text-xs text-slate-400">Latest issues submitted by you</p>
          </div>
          <Link
            href="/student/complaints"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View all ({total}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              You&apos;re all clear! No complaints have been submitted yet.
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              If you notice any electrical, plumbing, or IT issues across campus, submit a ticket.
            </p>
            <Link
              href="/student/complaints/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
            >
              + Submit a Complaint
            </Link>
          </div>
        ) : (
          <div>
            {/* MOBILE RECENT COMPLAINTS CARDS (< sm) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {recentComplaints.map((item) => (
                <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {item.complaintNumber}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <Link
                    href={`/student/complaints/${item.id}`}
                    prefetch={true}
                    className="font-bold text-xs text-slate-900 hover:text-purple-600 transition-colors block"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.locationBuilding}
                    </span>
                    <span>{formatTimeAgo(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP & TABLET TABLE (sm:) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/60">
                  <tr>
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Issue Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-purple-700">
                        {item.complaintNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {item.category.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {item.locationBuilding}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatTimeAgo(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/student/complaints/${item.id}`}
                          prefetch={true}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
