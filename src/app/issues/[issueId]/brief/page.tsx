import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { SectionNav } from "@/components/section-nav";
import { Badge, KpiTile, Panel, SectionTitle } from "@/components/ui";
import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BriefPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const issue = await getIssueDetail(issueId as StoryType).catch(() => null);

  if (!issue) {
    notFound();
  }

  return (
    <AppShell active="Manager Brief">
      <Panel className="flex items-center justify-between gap-4 py-4">
        <SectionNav issueId={issue.card.id} current="Manager Brief" />
      </Panel>
      <Panel className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="text-[13px] font-medium text-[#0B5FFF]">
              Leadership view
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#0f172a]">
              {issue.managerBrief.impactHeadline}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-[#4b5563]">
              {issue.card.currentHypothesis}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted">{issue.managerBrief.riskLevel} risk</Badge>
              <Badge tone="muted">{issue.card.timeWindow}</Badge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {issue.overviewMetrics.map((metric) => (
              <KpiTile
                key={metric.label}
                label={metric.label}
                value={metric.value}
                hint={metric.hint}
                tone={metric.tone}
              />
            ))}
          </div>
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel>
          <SectionTitle
            eyebrow="Decision needed"
            title="Executive decision"
            body={issue.managerBrief.decisionNeeded}
          />
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Containment"
            title="Current status"
            body={issue.managerBrief.containmentStatus}
          />
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Open actions"
            title="Progress snapshot"
            body={`${issue.evidence.actions.length} tracked actions are currently tied to this issue.`}
          />
        </Panel>
      </div>
      <Panel>
        <SectionTitle
          eyebrow="Unresolved questions"
          title="Before closure"
          body="This is the management-ready view of what still needs an explicit decision."
        />
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
          {issue.managerBrief.unresolvedQuestions.map((question) => (
            <li key={question} className="rounded-[12px] bg-slate-50 p-4">
              • {question}
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
