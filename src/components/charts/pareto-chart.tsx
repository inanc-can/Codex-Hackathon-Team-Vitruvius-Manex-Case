"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Panel, SectionTitle, chipClassName } from "@/components/ui";
import type { ParetoItem } from "@/lib/types";

export function ParetoChartPanel({
  data,
  selectedCode,
  onSelect,
}: {
  data: ParetoItem[];
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}) {
  const chartData = data.slice(0, 6);

  return (
    <Panel className="h-full">
      <SectionTitle
        eyebrow="Innovative visualization"
        title="Pareto chart"
        body="Rank failure modes fast and filter the issue evidence with a single click."
      />
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d7deea" />
            <XAxis dataKey="code" tick={{ fontSize: 11 }} angle={-18} textAnchor="end" height={56} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <ReferenceLine yAxisId="right" y={80} stroke="#D97706" strokeDasharray="4 4" />
            <Bar
              yAxisId="left"
              dataKey="count"
              radius={[8, 8, 0, 0]}
              fill="#0B5FFF"
              onClick={(state: { payload?: ParetoItem }) => {
                const code = state.payload?.code;
                if (!code) {
                  return;
                }
                onSelect(code === selectedCode ? null : code);
              }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#005B4A"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chartData.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => onSelect(item.code === selectedCode ? null : item.code)}
            aria-pressed={selectedCode === item.code}
            className={chipClassName(selectedCode === item.code)}
          >
            {item.code} · {item.count}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#5b6474]">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[4px] bg-[#0B5FFF]" />
          Defect count
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 bg-[#005B4A]" />
          Cumulative share
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 border-t border-dashed border-[#D97706]" />
          80% threshold
        </span>
      </div>
    </Panel>
  );
}
