import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, PageShell, chipClassName } from "@/components/ui";

export function AppShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <PageShell
      header={
        <header className="sticky top-0 z-20 border-b border-[#d7deea] bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Link href="/" className="inline-flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0B5FFF] text-sm font-bold text-white">
                    QC
                  </span>
                  <div>
                    <p className="text-[12px] font-medium text-[#5b6474]">
                      Quality Resolution Copilot
                    </p>
                    <h1 className="text-lg font-semibold tracking-tight text-[#0f172a]">
                      Manex x Vitruvius
                    </h1>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="success">ERP + MES live</Badge>
                <Badge tone="muted">Audit trail locked</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#eef2f7] pt-3 md:flex-row md:items-center md:justify-between">
              <nav className="hidden items-center gap-2 md:flex">
                {["Inbox", "Investigation", "Copilot", "Actions", "Manager Brief"].map(
                  (item) => (
                    <span
                      key={item}
                      className={chipClassName(active === item)}
                    >
                      {item}
                    </span>
                  ),
                )}
              </nav>
              <div className="grid gap-2 text-[12px] text-[#5b6474] sm:grid-cols-3 md:min-w-[540px]">
                <div className="rounded-[8px] border border-[#d7deea] bg-[#f7f9fc] px-3 py-2">
                  <p className="font-medium text-[#0f172a]">Workspace</p>
                  <p className="mt-0.5">Manufacturing Quality Command Center</p>
                </div>
                <div className="rounded-[8px] border border-[#d7deea] bg-[#f7f9fc] px-3 py-2">
                  <p className="font-medium text-[#0f172a]">Operating mode</p>
                  <p className="mt-0.5">{active ?? "Inbox"} workflow active</p>
                </div>
                <div className="rounded-[8px] border border-[#d7deea] bg-[#f7f9fc] px-3 py-2">
                  <p className="font-medium text-[#0f172a]">Governance</p>
                  <p className="mt-0.5">Decision-ready evidence and actions</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      }
    >
      {children}
    </PageShell>
  );
}
