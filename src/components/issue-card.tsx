import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";

import { Badge, Panel, buttonClassName, severityTone } from "@/components/ui";
import type { IssueCard as IssueCardType } from "@/lib/types";

export function IssueCard({ issue }: { issue: IssueCardType }) {
  return (
    <Panel className="flex h-full flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,252,0.96))]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge tone={severityTone(issue.severity)}>
              {issue.severity.replace("_", " ")} priority
            </Badge>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {issue.title}
            </h3>
          </div>
          <ShieldAlert className="h-5 w-5 text-[#D97706]" />
        </div>
        <p className="text-sm leading-6 text-slate-600">{issue.summary}</p>
        <div className="grid grid-cols-3 gap-3">
          {issue.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[12px] border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-[12px] font-medium text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {issue.primaryStakeholders.map((stakeholder) => (
            <Badge key={stakeholder} tone="muted">
              {stakeholder}
            </Badge>
          ))}
        </div>
        <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-[12px] font-medium text-slate-500">Current hypothesis</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{issue.currentHypothesis}</p>
          <p className="mt-3 text-xs text-slate-500">
            Active window: {issue.timeWindow}
          </p>
        </div>
      </div>
      <Link
        href={`/issues/${issue.id}`}
        className={buttonClassName()}
      >
        Open investigation
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Panel>
  );
}
