import type { StoryType } from "@/lib/types";

export const issueSectionLinks = (issueId: StoryType) => [
  { href: `/issues/${issueId}`, label: "Investigation" },
  { href: `/issues/${issueId}/copilot`, label: "Copilot Draft" },
  { href: `/issues/${issueId}/actions`, label: "Action Tracker" },
  { href: `/issues/${issueId}/brief`, label: "Manager Brief" },
];
