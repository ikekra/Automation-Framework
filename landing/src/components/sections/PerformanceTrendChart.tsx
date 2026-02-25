"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = {
  name: string;
  score: number;
};

export const PerformanceTrendChart = ({ data }: { data: Point[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[70, 100]} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid rgba(148,163,184,0.3)",
            background: "#ffffff",
            color: "#0f172a"
          }}
        />
        <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.16} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
