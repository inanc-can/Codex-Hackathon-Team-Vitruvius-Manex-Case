import Link from "next/link";

import { chipClassName } from "@/components/ui";
import { issueSectionLinks } from "@/lib/navigation";
import type { StoryType } from "@/lib/types";

export function SectionNav({
  issueId,
  current,
}: {
  issueId: StoryType;
  current: string;
}) {
  return (
    <nav
      aria-label="Issue sections"
      className="flex flex-wrap items-center gap-2"
    >
      {issueSectionLinks(issueId).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={current === item.label ? "page" : undefined}
          className={chipClassName(current === item.label)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
