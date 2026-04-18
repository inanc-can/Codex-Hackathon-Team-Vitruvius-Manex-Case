import Link from "next/link";
import { ArrowRight, CircleAlert, Clock3, RadioTower, UsersRound } from "lucide-react";

import { IssueExposureChart } from "@/components/charts/issue-exposure-chart";
import { IssueCard } from "@/components/issue-card";
import { Badge, KpiTile, Panel, SectionTitle, buttonClassName, severityTone } from "@/components/ui";
import type { IssueCard as IssueCardType } from "@/lib/types";
import { formatInt } from "@/lib/utils";

function workflowStatusFromSeverity(severity: IssueCardType["severity"]) {
  if (severity === "critical") {
    return { label: "Escalated", tone: "alert" as const };
  }

  if (severity === "high") {
    return { label: "Containment active", tone: "default" as const };
  }

  return { label: "Monitoring", tone: "muted" as const };
}

export function QualityDashboardSections({
  issues,
  totalProducts,
  totalClaims,
  stakeholderLenses,
  heroIssueHref,
  heroActionHref,
}: {
  issues: IssueCardType[];
  totalProducts: number;
  totalClaims: number;
  stakeholderLenses: number;
  heroIssueHref: string;
  heroActionHref: string;
}) {
  const priorityIssues = issues.filter(
    (issue) => issue.severity === "critical" || issue.severity === "high",
  ).length;
  const criticalIssues = issues.filter((issue) => issue.severity === "critical").length;
  const medianIssueExposure = issues.length
    ? Math.round(totalProducts / issues.length)
    : 0;
  const chartData = issues.map((issue) => ({
    name: issue.title.replace(" Investigation", "").replace(" Incident", ""),
    products: issue.affectedProducts,
    claims: issue.affectedClaims,
  }));
  const topIssues = issues
    .slice()
    .sort((left, right) => right.affectedProducts + right.affectedClaims - (left.affectedProducts + left.affectedClaims))
    .slice(0, 3);

  return (
    <>
      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-5 border-b border-[#eef2f7] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="muted">Dashboard</Badge>
              <Badge tone="default">Manufacturing quality operations</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
                Quality command center
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[#5b6474]">
                Monitor issue exposure, review investigation lanes, and move directly from detection to tracked corrective action.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={heroActionHref} className={buttonClassName({ variant: "secondary" })}>
              Review action queue
            </Link>
            <Link href={heroIssueHref} className={buttonClassName()}>
              Open investigation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2">
              <Badge tone="default">Cross-functional quality resolution</Badge>
              <Badge tone="muted">Evidence-linked workflow</Badge>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-[2.75rem]">
                Quality operations workspace for live investigations, corrective actions, and leadership communication.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#4b5563]">
                Replace fragmented reports with a single operating surface where engineering, supplier quality, field service,
                and plant leadership resolve the same incident from shared evidence, synchronized actions, and management-ready briefs.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
                <p className="text-[12px] font-medium text-[#5b6474]">Critical escalations</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{formatInt(criticalIssues)}</p>
                <p className="mt-2 text-xs text-[#5b6474]">Immediate leadership and containment coordination.</p>
              </div>
              <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
                <p className="text-[12px] font-medium text-[#5b6474]">Avg. exposure per issue</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{formatInt(medianIssueExposure)}</p>
                <p className="mt-2 text-xs text-[#5b6474]">Affected products linked to each active investigation lane.</p>
              </div>
              <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
                <p className="text-[12px] font-medium text-[#5b6474]">Executive-ready briefs</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{formatInt(issues.length)}</p>
                <p className="mt-2 text-xs text-[#5b6474]">Every lane can produce a management-ready narrative on demand.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-5">
            <div className="flex items-center justify-between gap-3 border-b border-[#d7deea] pb-4">
              <div>
                <p className="text-[12px] font-medium text-[#5b6474]">Operational response posture</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">Command overview</h2>
              </div>
              <Badge tone="success">Synchronized</Badge>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[12px] border border-[#d7deea] bg-white p-4">
                  <p className="text-[12px] font-medium text-[#5b6474]">Priority lanes</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">{formatInt(priorityIssues)}</p>
                </div>
                <div className="rounded-[12px] border border-[#d7deea] bg-white p-4">
                  <p className="text-[12px] font-medium text-[#5b6474]">Stakeholder breadth</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0f172a]">{formatInt(stakeholderLenses)}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-[#4b5563]">
                <div className="flex items-start justify-between gap-3 border-b border-[#d7deea] pb-3">
                  <div>
                    <p className="font-medium text-[#0f172a]">Containment discipline</p>
                    <p className="mt-1">Critical and high-severity issues remain visible with explicit workflow states.</p>
                  </div>
                  <Badge tone="warning">Watch</Badge>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[#d7deea] pb-3">
                  <div>
                    <p className="font-medium text-[#0f172a]">Evidence continuity</p>
                    <p className="mt-1">Claims, defects, BOM links, and actions share one investigation baseline.</p>
                  </div>
                  <Badge tone="success">Stable</Badge>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#0f172a]">Leadership readiness</p>
                    <p className="mt-1">Every issue lane can move directly into briefs and corrective action management.</p>
                  </div>
                  <Badge tone="default">Ready</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <section aria-labelledby="kpi-overview" className="space-y-4">
        <SectionTitle
          eyebrow="Performance snapshot"
          title="Quality signal overview"
          body="High-information KPI cards keep issue load, product exposure, and stakeholder breadth visible at all times."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            label="Priority issues"
            value={formatInt(priorityIssues)}
            hint="Critical and high-severity issues requiring active coordination."
            tone="alert"
          />
          <KpiTile
            label="Affected products"
            value={formatInt(totalProducts)}
            hint="Cross-issue product exposure under active investigation."
            tone="default"
          />
          <KpiTile
            label="Field claims"
            value={formatInt(totalClaims)}
            hint="Customer-visible impact connected into the same workflow."
            tone="alert"
          />
          <KpiTile
            label="Stakeholder lenses"
            value={formatInt(stakeholderLenses)}
            hint="Functional perspectives aligned to the same evidence baseline."
            tone="success"
          />
        </div>
      </section>

      <section aria-labelledby="operations-overview" className="space-y-4">
        <SectionTitle
          eyebrow="Operations overview"
          title="Exposure and lane control"
          body="A dashboard-first view of issue load, customer-visible impact, and where the team should focus next."
        />
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <Panel>
            <div className="flex items-center justify-between gap-3 border-b border-[#eef2f7] pb-4">
              <div>
                <p className="text-[12px] font-medium text-[#5b6474]">Issue exposure by lane</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">
                  Products and claims
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-[#5b6474]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[4px] bg-[#0B5FFF]" />
                  Affected products
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[4px] bg-[#D97706]" />
                  Field claims
                </span>
              </div>
            </div>
            <div className="mt-5">
              <IssueExposureChart data={chartData} />
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-3 border-b border-[#eef2f7] pb-4">
              <div>
                <p className="text-[12px] font-medium text-[#5b6474]">Control tower</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">
                  Next lanes to review
                </h3>
              </div>
              <Badge tone="warning">{priorityIssues} prioritized</Badge>
            </div>
            <div className="mt-4 space-y-4">
              {topIssues.map((issue) => (
                <div key={`${issue.id}-top`} className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#0f172a]">{issue.title}</p>
                      <p className="mt-1 text-sm text-[#5b6474]">{issue.summary}</p>
                    </div>
                    <Badge tone={severityTone(issue.severity)}>{issue.severity}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[12px] font-medium text-[#5b6474]">Products</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">{formatInt(issue.affectedProducts)}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#5b6474]">Claims</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">{formatInt(issue.affectedClaims)}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#5b6474]">Confidence</p>
                      <p className="mt-1 text-base font-semibold text-[#0f172a]">{issue.confidence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section aria-labelledby="recent-issues" className="space-y-4">
        <SectionTitle
          eyebrow="Recent Issues"
          title="Active investigation lanes"
          body="Card-level summaries remain available for teams that need quick stakeholder and hypothesis context before opening the full workspace."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <section aria-labelledby="portfolio-view" className="space-y-4">
        <SectionTitle
          eyebrow="Portfolio view"
          title="Issue portfolio matrix"
          body="A denser operational register makes severity, stakeholder span, and exposure comparable without leaving the dashboard."
        />
        <Panel className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[940px]">
              <div className="grid grid-cols-[1.5fr_0.8fr_0.9fr_1fr_1.1fr_auto] gap-4 border-b border-[#d7deea] bg-[#f7f9fc] px-5 py-3 text-[12px] font-medium text-[#5b6474]">
                <span>Issue</span>
                <span>Severity</span>
                <span>Confidence</span>
                <span>Exposure</span>
                <span>Stakeholders</span>
                <span className="text-right">Action</span>
              </div>
              <div>
                {issues.map((issue) => (
                  <div
                    key={`${issue.id}-portfolio`}
                    className="grid grid-cols-[1.5fr_0.8fr_0.9fr_1fr_1.1fr_auto] gap-4 border-b border-[#eef2f7] px-5 py-4 text-sm last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold text-[#0f172a]">{issue.title}</p>
                      <p className="mt-1 text-xs text-[#5b6474]">{issue.summary}</p>
                    </div>
                    <div className="flex items-start">
                      <Badge tone={severityTone(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <div className="font-medium text-[#334155]">{issue.confidence}</div>
                    <div className="font-medium text-[#334155]">
                      {formatInt(issue.affectedProducts)} products / {formatInt(issue.affectedClaims)} claims
                    </div>
                    <div className="text-[#334155]">{issue.primaryStakeholders.length} functions</div>
                    <div className="flex justify-end">
                      <Link href={`/issues/${issue.id}`} className={buttonClassName({ size: "sm", variant: "secondary" })}>
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section aria-labelledby="workflow-health" className="space-y-4">
        <SectionTitle
          eyebrow="Workflow Health"
          title="Timeline and status visibility"
          body="Resolution lanes show severity, confidence, and active windows so cross-functional teams can prioritize without losing chronology."
        />
        <Panel>
          <div className="grid gap-4 border-b border-slate-200 pb-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CircleAlert className="h-4 w-4 text-rose-600" />
                Escalations in flight
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatInt(priorityIssues)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <RadioTower className="h-4 w-4 text-sky-700" />
                Active issue lanes
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatInt(issues.length)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UsersRound className="h-4 w-4 text-emerald-700" />
                Functions aligned
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatInt(stakeholderLenses)}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3" role="list" aria-label="Issue lane health list">
            {issues.map((issue) => {
              const status = workflowStatusFromSeverity(issue.severity);
              return (
                <div
                  key={issue.id}
                  role="listitem"
                  className="grid gap-3 rounded-[12px] border border-slate-200 p-4 transition hover:bg-[#f7f9fc] lg:grid-cols-[1.5fr_0.7fr_0.8fr_0.7fr_auto] lg:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{issue.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{issue.summary}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-slate-500">Status</p>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-slate-500">Confidence</p>
                    <p className="text-sm font-medium text-slate-700">{issue.confidence}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-slate-500">Window</p>
                    <p className="inline-flex items-center gap-1 text-sm text-slate-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      {issue.timeWindow}
                    </p>
                  </div>
                  <Link
                    href={`/issues/${issue.id}`}
                    className={buttonClassName({ size: "sm" })}
                  >
                    View lane
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </Panel>
      </section>
    </>
  );
}
