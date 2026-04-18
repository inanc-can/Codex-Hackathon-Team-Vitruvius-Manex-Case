"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ExposureDatum = {
  name: string;
  products: number;
  claims: number;
};

export function IssueExposureChart({
  data,
}: {
  data: ExposureDatum[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid vertical={false} stroke="#d7deea" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#5b6474" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#5b6474" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: "#d7deea",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}
          />
          <Bar dataKey="products" fill="#0B5FFF" radius={[6, 6, 0, 0]} />
          <Bar dataKey="claims" fill="#D97706" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
