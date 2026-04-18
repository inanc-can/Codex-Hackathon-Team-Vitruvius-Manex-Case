import { notFound } from "next/navigation";

import { CopilotPanel } from "@/components/copilot-panel";
import { SectionNav } from "@/components/section-nav";
import { Panel, SectionTitle } from "@/components/ui";
import { buildCopilotDraft } from "@/lib/copilot";
import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CopilotPage({
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
        <SectionNav issueId={issue.card.id} current="Copilot Draft" />
      </Panel>
      <Panel>
        <SectionTitle
          eyebrow="Stakeholder-centered narrative"
          title={`${issue.card.title} · AI-assisted draft`}
          body="This page turns the connected evidence bundle into communication-ready sections while keeping the raw proof visible elsewhere in the workflow."
        />
      </Panel>
      <CopilotPanel draft={draft} />
    </>
  );
}
