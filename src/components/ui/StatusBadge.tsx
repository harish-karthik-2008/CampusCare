import React from "react";
import { STATUS_CONFIG, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  const config = STATUS_CONFIG[normalized] || {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-colors",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot, normalized === "IN_PROGRESS" && "animate-pulse")} />
      {config.label}
    </span>
  );
}
