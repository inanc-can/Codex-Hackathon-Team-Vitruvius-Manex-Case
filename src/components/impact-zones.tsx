"use client";

import type { IssueDetail } from "@/lib/types";
import { Panel, SectionTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

type ImpactZone = {
  zone: string;
  icon: string;
  defectCount: number;
  claimCount: number;
  totalCost: number;
  affectedProducts: Set<string>;
  tone: "default" | "alert" | "success" | "warning";
};

export function ImpactZonesPanel({ issue }: { issue: IssueDetail }) {
  // Aggregate impact data by manufacturing zone
  const zones = new Map<string, ImpactZone>();

  // Process defects
  issue.evidence.defects.forEach((defect) => {
    const section = defect.detected_section_name || "Assembly";
    if (!zones.has(section)) {
      zones.set(section, {
        zone: section,
        icon: getZoneIcon(section),
        defectCount: 0,
        claimCount: 0,
        totalCost: 0,
        affectedProducts: new Set(),
        tone: "default",
      });
    }
    const z = zones.get(section)!;
    z.defectCount++;
    z.totalCost += defect.cost ?? 0;
    z.affectedProducts.add(defect.product_id);
  });

  // Process claims
  issue.evidence.claims.forEach((claim) => {
    const section = claim.detected_section_name || "Field";
    if (!zones.has(section)) {
      zones.set(section, {
        zone: section,
        icon: getZoneIcon(section),
        defectCount: 0,
        claimCount: 0,
        totalCost: 0,
        affectedProducts: new Set(),
        tone: "default",
      });
    }
    const z = zones.get(section)!;
    z.claimCount++;
    z.totalCost += claim.cost ?? 0;
    z.affectedProducts.add(claim.product_id);
  });

  // Determine tone based on impact severity
  zones.forEach((zone) => {
    const impactScore = zone.defectCount + zone.claimCount * 3 + (zone.totalCost / 10000);
    if (impactScore > 20) zone.tone = "alert";
    else if (impactScore > 10) zone.tone = "warning";
    else zone.tone = "success";
  });

  const sortedZones = Array.from(zones.values()).sort(
    (a, b) =>
      b.claimCount * 3 +
      b.defectCount -
      (a.claimCount * 3 + a.defectCount)
  );

  return (
    <Panel className="h-full">
      <SectionTitle
        eyebrow="Impact visualization"
        title="Affected manufacturing zones"
        body="See where the issue cascades through your production value chain and which stakeholders feel the pain most."
      />
      <div className="mt-6 space-y-3">
        {sortedZones.map((zone) => {
          const bgColorMap = {
            alert: "bg-red-50 border-red-200",
            warning: "bg-amber-50 border-amber-200",
            success: "bg-emerald-50 border-emerald-200",
            default: "bg-slate-50 border-slate-200",
          };
          const textColorMap = {
            alert: "text-red-900",
            warning: "text-amber-900",
            success: "text-emerald-900",
            default: "text-slate-900",
          };
          const badgeColorMap = {
            alert: "bg-red-100 text-red-700",
            warning: "bg-amber-100 text-amber-700",
            success: "bg-emerald-100 text-emerald-700",
            default: "bg-slate-100 text-slate-700",
          };

          return (
            <div
              key={zone.zone}
              className={`rounded-[12px] border p-4 transition ${bgColorMap[zone.tone]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{zone.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${textColorMap[zone.tone]}`}>
                        {zone.zone}
                      </h3>
                      <p className={`text-sm ${textColorMap[zone.tone]} opacity-75`}>
                        {zone.affectedProducts.size} product(s) affected
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {zone.defectCount > 0 && (
                    <div className={`rounded-[8px] px-2.5 py-1 text-xs font-medium ${badgeColorMap[zone.tone]}`}>
                      {zone.defectCount} defect{zone.defectCount !== 1 ? "s" : ""}
                    </div>
                  )}
                  {zone.claimCount > 0 && (
                    <div className={`rounded-[8px] px-2.5 py-1 text-xs font-medium ${badgeColorMap[zone.tone]}`}>
                      {zone.claimCount} claim{zone.claimCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {zone.totalCost > 0 && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-10">
                  <p className={`text-sm font-semibold ${textColorMap[zone.tone]}`}>
                    Financial impact: {formatCurrency(zone.totalCost)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {sortedZones.length === 0 && (
          <div className="rounded-[12px] border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No impact data available
          </div>
        )}
      </div>
    </Panel>
  );
}

function getZoneIcon(section: string): string {
  const lowerSection = section.toLowerCase();
  if (
    lowerSection.includes("assembly") ||
    lowerSection.includes("build") ||
    lowerSection.includes("manufacture")
  ) {
    return "⚙️";
  }
  if (
    lowerSection.includes("test") ||
    lowerSection.includes("inspection") ||
    lowerSection.includes("qa")
  ) {
    return "🔍";
  }
  if (lowerSection.includes("field") || lowerSection.includes("customer")) {
    return "🌍";
  }
  if (lowerSection.includes("supply") || lowerSection.includes("material")) {
    return "📦";
  }
  if (lowerSection.includes("process") || lowerSection.includes("calibration")) {
    return "⚡";
  }
  return "📍";
}
