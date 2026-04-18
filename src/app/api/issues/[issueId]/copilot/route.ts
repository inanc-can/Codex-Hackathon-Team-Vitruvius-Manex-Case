import { NextResponse } from "next/server";

import { buildCopilotDraft } from "@/lib/copilot";
import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";

export async function POST(
  _request: Request,
  context: { params: Promise<{ issueId: string }> },
) {
  try {
    const { issueId } = await context.params;
    const issue = await getIssueDetail(issueId as StoryType);
    return NextResponse.json(buildCopilotDraft(issue));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 },
    );
  }
}
