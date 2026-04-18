import { notFound } from "next/navigation";

import { InvestigationWorkspace } from "@/components/investigation-workspace";
import { SectionNav } from "@/components/section-nav";
import { Panel } from "@/components/ui";
import { buildCopilotDraft } from "@/lib/copilot";
import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  const issue = await getIssueDetail(issueId as StoryType).catch(() => null);

  if (!issue) {
    notFound();
  }

  const draft = buildCopilotDraft(issue);

  return (
    <>
      <Panel className="flex items-center justify-between gap-4 py-4">
        <SectionNav issueId={issue.card.id} current="Investigation" />
      </Panel>
      <InvestigationWorkspace issue={issue} draft={draft} />
    </>
  );
}
