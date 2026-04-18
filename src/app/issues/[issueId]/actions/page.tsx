import { notFound } from "next/navigation";

import { ActionForm } from "@/components/action-form";
import { AppShell } from "@/components/app-shell";
import { SectionNav } from "@/components/section-nav";
import { Badge, Panel, SectionTitle } from "@/components/ui";
import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";
import { formatDate, humanizeToken } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActionsPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const issue = await getIssueDetail(issueId as StoryType).catch(() => null);

  if (!issue) {
    notFound();
  }

  const suggestedOwners = Array.from(
    new Set([
      ...issue.evidence.rework.map((item) => item.user_id).filter(Boolean),
      ...issue.evidence.actions.map((item) => item.user_id).filter(Boolean),
      "user_017",
      "user_023",
    ]),
  ) as string[];
  const openActions = issue.evidence.actions.filter((action) => action.status !== "done").length;
  const completedActions = issue.evidence.actions.filter((action) => action.status === "done").length;

  return (
    <AppShell active="Actions">
      <Panel className="flex items-center justify-between gap-4 py-4">
        <SectionNav issueId={issue.card.id} current="Action Tracker" />
      </Panel>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <SectionTitle
            eyebrow="Closed-loop workflow"
            title="Create a new corrective action"
            body="The report should not disappear into a folder. Every next step should become a tracked action in the live workflow."
          />
          <div className="mt-5">
            <ActionForm
              issueId={issue.card.id}
              productId={issue.card.anchorProductId}
              defectId={issue.card.anchorDefectId}
              suggestedOwners={suggestedOwners}
            />
          </div>
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Tracked actions"
            title="Action tracker"
            body="Owners, statuses, and comments stay attached to the issue instead of being split across email threads."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
              <p className="text-[12px] font-medium text-[#5b6474]">Total actions</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{issue.evidence.actions.length}</p>
            </div>
            <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
              <p className="text-[12px] font-medium text-[#5b6474]">Open / in flight</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{openActions}</p>
            </div>
            <div className="rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4">
              <p className="text-[12px] font-medium text-[#5b6474]">Completed</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">{completedActions}</p>
            </div>
          </div>
          <div className="mt-5">
            {issue.evidence.actions.length ? (
              <div className="overflow-x-auto rounded-[12px] border border-[#d7deea]">
                <div className="min-w-[860px]">
                  <div className="grid grid-cols-[1fr_0.85fr_0.85fr_0.8fr_1.8fr] gap-4 bg-[#f7f9fc] px-4 py-3 text-[12px] font-medium text-[#5b6474]">
                    <span>Action</span>
                    <span>Status</span>
                    <span>Owner</span>
                    <span>Date</span>
                    <span>Comments</span>
                  </div>
                  {issue.evidence.actions.map((action) => (
                    <div
                      key={action.action_id}
                      className="grid grid-cols-[1fr_0.85fr_0.85fr_0.8fr_1.8fr] gap-4 border-t border-[#eef2f7] px-4 py-4 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-[#0f172a]">{humanizeToken(action.action_type)}</p>
                        <p className="mt-1 text-xs text-[#5b6474]">{action.action_id}</p>
                      </div>
                      <div className="flex items-start">
                        <Badge tone={action.status === "done" ? "success" : action.status === "blocked" ? "warning" : "muted"}>
                          {humanizeToken(action.status)}
                        </Badge>
                      </div>
                      <div className="font-medium text-[#334155]">{humanizeToken(action.user_id)}</div>
                      <div className="font-medium text-[#334155]">{formatDate(action.ts)}</div>
                      <div className="text-[#4b5563]">
                        {action.comments ?? "No comment provided."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                No actions have been tracked yet. Use the form to turn the current hypothesis into an owned workflow item.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
