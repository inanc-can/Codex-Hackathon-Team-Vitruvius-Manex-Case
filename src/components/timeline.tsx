"use client";

import { useMemo } from "react";

import type { TimelineEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Panel, SectionTitle, chipClassName } from "@/components/ui";

const tones: Record<TimelineEvent["type"], string> = {
  build: "bg-[#0B5FFF] text-white",
  defect: "bg-[#fff1f0] text-[#b42318]",
  claim: "bg-[#fff7eb] text-[#8a4b00]",
  rework: "bg-[#e8efff] text-[#0B5FFF]",
  action: "bg-[#edf8f5] text-[#005B4A]",
};

export function TimelinePanel({
  events,
  selectedType,
  onSelect,
}: {
  events: TimelineEvent[];
  selectedType: TimelineEvent["type"] | null;
  onSelect: (type: TimelineEvent["type"] | null) => void;
}) {
  const summary = useMemo(() => {
    const counts = new Map<TimelineEvent["type"], number>();
    events.forEach((event) => {
      counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
    });
    return counts;
  }, [events]);

  return (
    <Panel>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Innovative visualization"
          title="Chronology timeline"
          body="Track builds, defects, claims, rework, and actions in one operational history."
        />
        <div className="flex flex-wrap gap-2">
          {(["build", "defect", "claim", "rework", "action"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type === selectedType ? null : type)}
              aria-pressed={selectedType === type}
              className={chipClassName(selectedType === type)}
            >
              {type} · {summary.get(type) ?? 0}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4 border-l-2 border-[#d7deea] pl-5">
        {(selectedType ? events.filter((event) => event.type === selectedType) : events)
          .slice(0, 14)
          .map((event) => (
            <button
              type="button"
              key={event.id}
              onClick={() => onSelect(selectedType === event.type ? null : event.type)}
              className="relative block w-full rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4 text-left transition hover:bg-[#eef2f7]"
            >
              <span className="absolute -left-[31px] top-6 h-4 w-4 rounded-full border-4 border-white bg-[#0B5FFF]" />
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-[8px] px-2.5 py-1 text-xs font-medium ${tones[event.type]}`}>
                  {event.type}
                </span>
                <p className="text-sm font-semibold text-slate-950">{event.title}</p>
                <p className="text-xs text-slate-500">{formatDate(event.date)}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{event.detail}</p>
            </button>
          ))}
      </div>
    </Panel>
  );
}
