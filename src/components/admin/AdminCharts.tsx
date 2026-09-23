"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const CATEGORY_COLORS = [
  "#7C52F6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#64748B",
];

export function CategoryDonutChart({ data }: { data: { name: string; count: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-56 w-full flex items-center justify-center text-slate-300 text-xs">Loading chart...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-56 w-full flex items-center justify-center text-slate-400 text-xs">No category data</div>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell
                key={`cat-cell-${index}`}
                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusBarChart({ data }: { data: { name: string; count: number; fill: string }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-56 w-full flex items-center justify-center text-slate-300 text-xs">Loading chart...</div>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "#F8FAFC" }}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TimelineAreaChart({ data }: { data: { day: string; complaints: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-56 w-full flex items-center justify-center text-slate-300 text-xs">Loading chart...</div>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C52F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C52F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="complaints"
            stroke="#7C52F6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#purpleGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
