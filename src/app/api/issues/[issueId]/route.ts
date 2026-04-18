import { NextResponse } from "next/server";

import { getIssueDetail } from "@/lib/manex";
import type { StoryType } from "@/lib/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ issueId: string }> },
) {
  try {
    const { issueId } = await context.params;
    const detail = await getIssueDetail(issueId as StoryType);
    return NextResponse.json(detail);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 },
    );
  }
}
