"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, LifeBuoyIcon, SendIcon, FrameIcon, PieChartIcon, MapIcon, TerminalIcon } from "lucide-react"

const DEFAULT_ISSUE_ID = "supplier_material"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const issueId = pathname.match(/^\/issues\/([^/]+)/)?.[1] ?? DEFAULT_ISSUE_ID
  const issueBasePath = `/issues/${issueId}`

  const data = {
    user: {
      name: "Quality Copilot",
      email: "ops@manex.example",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Inbox",
        url: "/",
        icon: (
          <TerminalSquareIcon
          />
        ),
        isActive: pathname === "/",
      },
      {
        title: "Investigation",
        url: issueBasePath,
        icon: (
          <BookOpenIcon
          />
        ),
        isActive: pathname === issueBasePath,
      },
      {
        title: "Copilot Draft",
        url: `${issueBasePath}/copilot`,
        icon: (
          <BotIcon
          />
        ),
        isActive: pathname === `${issueBasePath}/copilot`,
      },
      {
        title: "Action Tracker",
        url: `${issueBasePath}/actions`,
        icon: (
          <Settings2Icon
          />
        ),
        isActive: pathname === `${issueBasePath}/actions`,
      },
    ],
    navSecondary: [
      {
        title: "Manager Brief",
        url: `${issueBasePath}/brief`,
        icon: (
          <LifeBuoyIcon
          />
        ),
      },
      {
        title: "Current Investigation",
        url: issueBasePath,
        icon: (
          <SendIcon
          />
        ),
      },
    ],
    projects: [
      {
        name: "Supplier Material",
        url: "/issues/supplier_material",
        icon: (
          <FrameIcon
          />
        ),
      },
      {
        name: "Process Drift",
        url: "/issues/process_drift",
        icon: (
          <PieChartIcon
          />
        ),
      },
      {
        name: "Design Weakness",
        url: "/issues/design_weakness",
        icon: (
          <MapIcon
          />
        ),
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Quality Ops</span>
                  <span className="truncate text-xs">Manex x Vitruvius</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
