"use client";

import type { FaultNode } from "@/lib/types";

import { Panel, SectionTitle } from "@/components/ui";

const stateStyles = {
  supported: "border-[#b9e4da] bg-[#edf8f5] text-[#005B4A]",
  weakly_supported: "border-[#f3d7aa] bg-[#fff7eb] text-[#8a4b00]",
  contradicted: "border-[#d7deea] bg-[#eef2f7] text-[#5b6474]",
  unknown: "border-[#c9d8ff] bg-[#e8efff] text-[#0B5FFF]",
};

export function FaultTreePanel({
  nodes,
  selectedNode,
  onSelect,
}: {
  nodes: FaultNode[];
  selectedNode: string | null;
  onSelect: (label: string | null) => void;
}) {
  return (
    <Panel className="h-full">
      <SectionTitle
        eyebrow="Innovative visualization"
        title="Fault tree"
        body="Map symptom to possible cause classes and make the evidence trail legible."
      />
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="rounded-[12px] bg-[#0B5FFF] px-6 py-4 text-center text-sm font-semibold text-white">
          Active quality signal
        </div>
        <div className="grid w-full gap-3 md:grid-cols-2">
          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() =>
                onSelect(selectedNode === node.label ? null : node.label)
              }
              aria-pressed={selectedNode === node.label}
              className={`rounded-[12px] border p-4 text-left transition ${stateStyles[node.state]} ${
                selectedNode === node.label ? "ring-2 ring-[#0B5FFF]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{node.label}</p>
                <span className="rounded-[8px] bg-white/70 px-2 py-1 text-[12px] font-medium">
                  {node.evidenceCount}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6">{node.summary}</p>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
