"use client";

import type { IssueDetail, Stakeholder } from "@/lib/types";
import { Panel, SectionTitle } from "@/components/ui";

type PainPoint = {
  stakeholder: Stakeholder;
  pain: string;
  severity: "high" | "medium" | "low";
  context: string;
};

export function UserPainPointsPanel({ issue }: { issue: IssueDetail }) {
  const painPoints = derivePainPoints(issue);

  const severityColors = {
    high: "bg-red-50 border-red-200 text-red-900",
    medium: "bg-amber-50 border-amber-200 text-amber-900",
    low: "bg-blue-50 border-blue-200 text-blue-900",
  };

  return (
    <Panel className="h-full">
      <SectionTitle
        eyebrow="Stakeholder context"
        title="User pain points"
        body="What frustrations does this issue create for your team? Understand the human side of the quality problem."
      />

      <div className="mt-6 space-y-4">
        {painPoints.map((pp, idx) => (
          <div
            key={idx}
            className={`rounded-[12px] border p-4 transition ${severityColors[pp.severity]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium opacity-75">{pp.stakeholder}</p>
                <h4 className="mt-1 font-semibold">{pp.pain}</h4>
              </div>
              <span className="rounded-[6px] bg-white/50 px-2 py-1 text-xs font-medium uppercase">
                {pp.severity}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 opacity-80">{pp.context}</p>
          </div>
        ))}

        {painPoints.length === 0 && (
          <div className="rounded-[12px] border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Unable to extract pain point data from current issue
          </div>
        )}
      </div>
    </Panel>
  );
}

function derivePainPoints(issue: IssueDetail): PainPoint[] {
  const points: PainPoint[] = [];

  // Map stakeholders to their typical pain points based on issue type and evidence
  const defectCount = issue.evidence.defects.length;
  const claimCount = issue.evidence.claims.length;
  const hasRework = issue.evidence.rework.length > 0;
  const totalDefectCost = issue.evidence.defects.reduce((sum, d) => sum + (d.cost ?? 0), 0);
  const totalClaimCost = issue.evidence.claims.reduce((sum, c) => sum + (c.cost ?? 0), 0);

  // Quality Engineer pain points
  if (defectCount > 5) {
    points.push({
      stakeholder: "Quality Engineer",
      pain: "High defect volume complicating root cause analysis",
      severity: "high",
      context: `${defectCount} defects detected. Multiple failure modes require systematic investigation to avoid false solutions.`,
    });
  }

  if (issue.evidence.biasChecks.some((bc) => bc.status === "watch")) {
    points.push({
      stakeholder: "Quality Engineer",
      pain: "Potential confirmation bias in evidence interpretation",
      severity: "medium",
      context: "Need careful evidence review to ensure all hypotheses are challenged fairly.",
    });
  }

  // Production/Operations pain points
  if (hasRework) {
    points.push({
      stakeholder: "Production / Operations",
      pain: "Rework burden slowing production throughput",
      severity: totalDefectCost > 50000 ? "high" : "medium",
      context: `${issue.evidence.rework.length} rework operations logged. Containment essential to prevent cascading delays.`,
    });
  }

  if (totalDefectCost > 100000) {
    points.push({
      stakeholder: "Production / Operations",
      pain: "Significant scrap/rework cost impacting P&L",
      severity: "high",
      context: `Defect-related costs exceed $${(totalDefectCost / 1000).toFixed(0)}K. Urgency for containment actions.`,
    });
  }

  // Process Engineer pain points
  if (issue.card.storyType === "process_drift") {
    points.push({
      stakeholder: "Process Engineer",
      pain: "Process parameters drifting out of specification",
      severity: "high",
      context: "Calibration or tool wear likely culprit. Preventive adjustments needed to stop recurrence.",
    });
  }

  // Supplier Quality Engineer pain points
  if (issue.card.storyType === "supplier_material") {
    points.push({
      stakeholder: "Supplier Quality Engineer",
      pain: "Material quality variation from supply chain",
      severity: defectCount > 10 ? "high" : "medium",
      context: `${defectCount} defects traced to supplier components. Incoming inspection or supplier process review needed.`,
    });
  }

  // Field Service/Customer Quality pain points
  if (claimCount > 3) {
    points.push({
      stakeholder: "Field Service / Customer Quality",
      pain: "Customer complaints and warranty claims escalating",
      severity: totalClaimCost > 200000 ? "high" : "medium",
      context: `${claimCount} field claims submitted. Risk of reputation damage and customer churn if not resolved quickly.`,
    });
  }

  // R&D/Design Engineer pain points
  if (issue.card.storyType === "design_weakness") {
    points.push({
      stakeholder: "R&D / Design Engineer",
      pain: "Design limitation requiring redesign or alternate solution",
      severity: "high",
      context: "Fundamental design weakness identified. Mitigation or redesign cycle needed to prevent long-term liability.",
    });
  }

  // Quality Manager pain points
  if (issue.card.severity === "critical" || totalDefectCost + totalClaimCost > 300000) {
    points.push({
      stakeholder: "Quality Manager / Plant Manager",
      pain: "Executive-level quality crisis threatening operational KPIs",
      severity: "high",
      context: "Escalation and containment plan required for management review. Impact on OEE and customer satisfaction.",
    });
  }

  return points;
}
