import { NextResponse } from "next/server";

import { createIssueAction, getIssueActions } from "@/lib/manex";
import type { CreateActionInput, StoryType } from "@/lib/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ issueId: string }> },
) {
  try {
    const { issueId } = await context.params;
    const actions = await getIssueActions(issueId as StoryType);
    return NextResponse.json(actions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 404 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ issueId: string }> },
) {
  try {
    const { issueId } = await context.params;
    const payload = (await request.json()) as CreateActionInput;

    if (!payload.productId || !payload.actionType || !payload.ownerUserId) {
      return NextResponse.json(
        { error: "productId, actionType, and ownerUserId are required." },
        { status: 400 },
      );
    }

    const created = await createIssueAction(issueId as StoryType, payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 },
    );
  }
}
