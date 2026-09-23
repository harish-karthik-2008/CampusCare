import React from "react";
import { PRIORITY_CONFIG, cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const normalized = priority.toUpperCase();
  const config = PRIORITY_CONFIG[normalized] || {
    label: priority,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  const getIcon = () => {
    if (!showIcon) return null;
    if (normalized === "CRITICAL") return <AlertTriangle className="w-3 h-3 text-red-600 animate-bounce" />;
    if (normalized === "HIGH") return <AlertCircle className="w-3 h-3 text-amber-600" />;
    return <CheckCircle2 className="w-3 h-3 text-slate-400" />;
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-2xs tracking-wide uppercase",
        config.bg,
        config.text,
        config.border,
        normalized === "CRITICAL" && "ring-2 ring-red-400/30",
        className
      )}
    >
      {getIcon()}
      {config.label}
    </span>
  );
}
