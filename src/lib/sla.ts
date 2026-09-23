// SLA Thresholds in Hours:
// Normal: 72 hrs | High: 48 hrs | Critical: 24 hrs
export const SLA_HOURS: Record<string, number> = {
  NORMAL: 72,
  HIGH: 48,
  CRITICAL: 24,
};

export interface SLAStatus {
  isOverdue: boolean;
  hoursRemaining: number;
  totalHours: number;
  percentageUsed: number;
  deadline: Date;
}

export function calculateSLA(
  createdAt: string | Date,
  priority: string,
  status: string,
  resolvedAt?: string | Date | null
): SLAStatus {
  const created = new Date(createdAt).getTime();
  const totalHours = SLA_HOURS[priority.toUpperCase()] || 72;
  const deadlineMs = created + totalHours * 60 * 60 * 1000;
  const deadline = new Date(deadlineMs);

  // If already resolved or closed, evaluate whether it was resolved within SLA
  const evaluationTime =
    status === "RESOLVED" || status === "CLOSED"
      ? resolvedAt
        ? new Date(resolvedAt).getTime()
        : Date.now()
      : Date.now();

  const diffMs = deadlineMs - evaluationTime;
  const hoursRemaining = Math.round(diffMs / (60 * 60 * 1000));
  const isOverdue = diffMs < 0;

  const elapsedMs = evaluationTime - created;
  const percentageUsed = Math.min(
    100,
    Math.max(0, Math.round((elapsedMs / (totalHours * 60 * 60 * 1000)) * 100))
  );

  return {
    isOverdue,
    hoursRemaining,
    totalHours,
    percentageUsed,
    deadline,
  };
}
