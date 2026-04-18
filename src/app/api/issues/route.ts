import { NextResponse } from "next/server";

import { getIssues } from "@/lib/manex";

export async function GET() {
  const issues = await getIssues();
  return NextResponse.json(issues);
}
