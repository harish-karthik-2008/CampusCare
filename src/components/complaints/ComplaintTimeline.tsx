import React from "react";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, Wrench, ShieldCheck, Flag } from "lucide-react";

export interface TimelineLog {
  id: string;
  action: string;
  note?: string | null;
  createdAt: string | Date;
  actor: {
    name: string;
    role: string;
  };
}

interface ComplaintTimelineProps {
  logs: TimelineLog[];
  currentStatus: string;
  createdAt: string | Date;
  resolvedAt?: string | Date | null;
  closedAt?: string | Date | null;
}

export function ComplaintTimeline({
  logs = [],
  currentStatus,
  createdAt,
  resolvedAt,
  closedAt,
}: ComplaintTimelineProps) {
  const stages = [
    { key: "SUBMITTED", label: "Submitted", icon: Flag },
    { key: "REVIEWED", label: "Reviewed & Assigned", icon: Clock },
    { key: "IN_PROGRESS", label: "In Progress", icon: Wrench },
    { key: "RESOLVED", label: "Resolved", icon: CheckCircle2 },
    { key: "CLOSED", label: "Closed", icon: ShieldCheck },
  ];

  const statusOrder: Record<string, number> = {
    PENDING: 1,
    IN_PROGRESS: 3,
    RESOLVED: 4,
    CLOSED: 5,
  };

  const currentLevel = statusOrder[currentStatus.toUpperCase()] || 1;

  return (
    <div className="space-y-6">
      {/* Visual Progress Bar on Desktop */}
      <div className="hidden md:flex items-center justify-between relative px-4 py-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-8 h-1 bg-purple-600 -translate-y-1/2 z-0 transition-all duration-700"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, ((currentLevel - 1) / (stages.length - 1)) * 100)
            )}%`,
          }}
        />

        {stages.map((stage, idx) => {
          const stepNumber = idx + 1;
          const isPassed = stepNumber <= currentLevel;
          const isCurrent = stepNumber === currentLevel;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  isPassed
                    ? "bg-purple-600 text-white ring-4 ring-purple-100"
                    : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  isCurrent
                    ? "text-purple-700 font-bold"
                    : isPassed
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Chronological Event Feed */}
      <div className="flow-root pl-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Resolution Audit Trail
        </h4>
        <ul className="-mb-8">
          {logs.map((log, idx) => {
            const isLast = idx === logs.length - 1;
            return (
              <li key={log.id}>
                <div className="relative pb-8">
                  {!isLast && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3 items-start">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center ring-8 ring-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {log.note || log.action.replace("_", " ")}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          By <span className="font-medium text-slate-700">{log.actor.name}</span>{" "}
                          ({log.actor.role})
                        </p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-slate-400">
                        <time dateTime={new Date(log.createdAt).toISOString()}>
                          {formatDate(log.createdAt)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
