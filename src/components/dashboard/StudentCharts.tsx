"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ChartItem {
  name: string;
  value: number;
  fill: string;
}

export default function StudentCharts({ data }: { data: ChartItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  if (!mounted) {
    return <div className="h-44 w-full flex items-center justify-center text-slate-300 text-xs">Loading chart...</div>;
  }

  if (totalValue === 0) {
    return (
      <div className="h-44 w-full flex items-center justify-center text-slate-400 text-xs">
        No complaints to display
      </div>
    );
  }

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={68}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
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
