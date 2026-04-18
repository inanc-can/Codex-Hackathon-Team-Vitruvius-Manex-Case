"use client";

import { useState } from "react";

import type { TraceabilityNode } from "@/lib/types";
import { Panel, SectionTitle, chipClassName } from "@/components/ui";

export function BomTraceabilityPanel({
  tree,
  selectedPart,
  onSelect,
}: {
  tree: TraceabilityNode[];
  selectedPart: string | null;
  onSelect: (partNumber: string | null) => void;
}) {
  const [affectedOnly, setAffectedOnly] = useState(true);

  return (
    <Panel className="h-full">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          eyebrow="Innovative visualization"
          title="BOM traceability explorer"
          body="Connect issue -> assembly -> BOM position -> part -> batch -> supplier without flattening it into a dead table."
        />
        <button
          type="button"
          onClick={() => setAffectedOnly((value) => !value)}
          aria-pressed={affectedOnly}
          className={chipClassName(affectedOnly)}
        >
          {affectedOnly ? "Showing affected only" : "Showing all linked parts"}
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {tree.map((group) => {
          const items = affectedOnly
            ? group.items.filter((item) => item.highlighted)
            : group.items;
          if (!items.length) {
            return null;
          }
          return (
            <div
              key={group.assembly}
              className="rounded-[12px] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-slate-500">{group.assemblyType}</p>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {group.assembly}
                  </h3>
                </div>
                <span className="rounded-[8px] bg-white px-3 py-1 text-[12px] font-medium text-slate-600">
                  {items.length} linked parts
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <button
                    key={`${group.assembly}-${item.productId}-${item.partNumber}-${item.findNumber}`}
                    type="button"
                    onClick={() =>
                      onSelect(selectedPart === item.partNumber ? null : item.partNumber)
                    }
                    aria-pressed={selectedPart === item.partNumber}
                    className={`grid w-full gap-3 rounded-[12px] border p-3 text-left md:grid-cols-[90px_1fr_140px_160px] ${
                      selectedPart === item.partNumber
                        ? "border-amber-300 bg-amber-50"
                        : item.highlighted
                          ? "border-sky-200 bg-white"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <p className="text-[12px] font-medium text-slate-500">Position</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {item.findNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {item.partTitle}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.partNumber} · Product {item.productId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-slate-500">Batch</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {item.batchId ?? "n/a"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-slate-500">Supplier</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {item.supplierName ?? "n/a"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
