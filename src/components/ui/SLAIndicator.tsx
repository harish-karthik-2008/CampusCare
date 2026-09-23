import React from "react";
import { calculateSLA } from "@/lib/sla";
import { Clock, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SLAIndicatorProps {
  createdAt: string | Date;
  priority: string;
  status: string;
  resolvedAt?: string | Date | null;
  compact?: boolean;
}

export function SLAIndicator({
  createdAt,
  priority,
  status,
  resolvedAt,
  compact = false,
}: SLAIndicatorProps) {
  const sla = calculateSLA(createdAt, priority, status, resolvedAt);
  const isFinished = status === "RESOLVED" || status === "CLOSED";

  if (compact) {
    if (sla.isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-300">
          <AlertOctagon className="w-3 h-3 text-red-600" />
          OVERDUE
        </span>
      );
    }
    if (isFinished) {
      return (
        <span className="text-xs text-slate-500 font-medium">Met SLA</span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
        <Clock className="w-3 h-3 text-slate-400" />
        {sla.hoursRemaining}h left
      </span>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="flex items-center gap-1 text-slate-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Target SLA ({sla.totalHours}h)
        </span>
        {sla.isOverdue ? (
          <span className="font-bold text-red-600 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            Overdue by {Math.abs(sla.hoursRemaining)}h
          </span>
        ) : isFinished ? (
          <span className="font-semibold text-emerald-600">Resolved in time</span>
        ) : (
          <span className="font-medium text-slate-700">
            {sla.hoursRemaining}h remaining
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            sla.isOverdue
              ? "bg-red-500"
              : sla.percentageUsed > 75
              ? "bg-amber-500"
              : "bg-emerald-500"
          )}
          style={{ width: `${Math.min(100, sla.percentageUsed)}%` }}
        />
      </div>
    </div>
  );
}
