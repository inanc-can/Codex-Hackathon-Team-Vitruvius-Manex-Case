"use client";

import Link from "next/link";
import { Bot, ClipboardList, FileText, FlaskConical, Inbox, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { chipClassName } from "@/components/ui";

type DashboardNavItem = {
  label: "Inbox" | "Investigations" | "Actions" | "Briefs" | "Copilot";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navGroups: Array<{ title: string; items: DashboardNavItem[] }> = [
  {
    title: "Resolution Workflow",
    items: [
      { label: "Inbox", href: "/", icon: Inbox },
      { label: "Investigations", href: "__INVESTIGATION__", icon: FlaskConical },
      { label: "Actions", href: "__ACTIONS__", icon: ClipboardList },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Briefs", href: "__BRIEFS__", icon: FileText },
      { label: "Copilot", href: "__COPILOT__", icon: Bot },
    ],
  },
];

export function QualityDashboardShell({
  children,
  active,
  heroIssueId,
}: {
  children: ReactNode;
  active: DashboardNavItem["label"];
  heroIssueId: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groups = useMemo(() => {
    return navGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        href: item.href
          .replace("__INVESTIGATION__", `/issues/${heroIssueId}`)
          .replace("__ACTIONS__", `/issues/${heroIssueId}/actions`)
          .replace("__BRIEFS__", `/issues/${heroIssueId}/brief`)
          .replace("__COPILOT__", `/issues/${heroIssueId}/copilot`),
      })),
    }));
  }, [heroIssueId]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#0f172a] md:flex">
      <a
        href="#dashboard-main"
        className="sr-only z-50 rounded-lg bg-[#0B5FFF] px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to dashboard content
      </a>
      <aside
        className={`hidden h-screen shrink-0 flex-col border-r border-[#d7deea] bg-white md:flex ${
          collapsed ? "w-20" : "w-72"
        }`}
        aria-label="Primary dashboard navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#d7deea] px-4">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0B5FFF] text-sm font-bold text-white">
              QC
            </span>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-slate-500">
                  Quality Operations
                </p>
                <p className="truncate text-sm font-semibold text-slate-950">Manex x Vitruvius</p>
              </div>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((previous) => !previous)}
            className="hidden rounded-[8px] border border-[#d7deea] bg-white p-2 text-[#5b6474] transition hover:bg-[#eef2f7] lg:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.title} className="space-y-2">
              {!collapsed ? (
                <p className="px-2 text-[12px] font-medium text-slate-400">
                  {group.title}
                </p>
              ) : null}
              <ul className="space-y-1" role="list">
                {group.items.map((item) => {
                  const isActive = active === item.label;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex items-center gap-3 ${chipClassName(isActive)}`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#d7deea] p-4">
          {!collapsed ? (
            <p className="text-xs text-[#5b6474]">Live quality signals with cross-functional evidence trails.</p>
          ) : (
            <span className="sr-only">Live quality signals with cross-functional evidence trails.</span>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:flex md:h-screen md:flex-col">
        <header className="sticky top-0 z-20 border-b border-[#d7deea] bg-white md:block">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0B5FFF] text-sm font-bold text-white">
                  QC
                </span>
                <div>
                  <p className="text-[12px] font-medium text-slate-500">
                    Quality Operations
                  </p>
                  <p className="text-sm font-semibold text-slate-950">Dashboard</p>
                </div>
              </Link>
              <div className="hidden md:block">
                <p className="text-[12px] font-medium text-[#5b6474]">Workspace</p>
                <p className="text-sm font-semibold text-[#0f172a]">
                  Active issue focus on {heroIssueId.replaceAll("_", " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <p className="text-[12px] font-medium text-[#5b6474]">Current module</p>
                <p className="text-sm font-semibold text-[#0f172a]">{active}</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-[8px] border border-[#d7deea] bg-white p-2 text-[#334155] md:hidden"
                aria-label="Open navigation menu"
                aria-controls="mobile-dashboard-drawer"
                aria-expanded={drawerOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {drawerOpen ? (
          <div className="fixed inset-0 z-40 md:hidden" aria-hidden={!drawerOpen}>
            <button
              type="button"
              className="absolute inset-0 bg-[#0f172a]/45"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            />
            <aside
              id="mobile-dashboard-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile dashboard navigation"
              className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r border-[#d7deea] bg-white p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4">
                <p className="text-sm font-semibold text-slate-950">Quality navigation</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg border border-[#d7deea] p-2 text-[#5b6474]"
                  aria-label="Close mobile navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-6">
                {groups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <p className="text-[12px] font-medium text-slate-400">
                      {group.title}
                    </p>
                    <ul className="space-y-1" role="list">
                      {group.items.map((item) => {
                        const isActive = active === item.label;
                        return (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setDrawerOpen(false)}
                              aria-current={isActive ? "page" : undefined}
                              className={`flex items-center gap-3 ${chipClassName(isActive)}`}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        ) : null}

        <main
          id="dashboard-main"
          className="flex flex-1 flex-col gap-6 overflow-auto p-4 md:p-6"
        >
            {children}
        </main>
      </div>
    </div>
  );
}
