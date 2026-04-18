"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
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
import Link from "next/link"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, ClipboardListIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, BotIcon, CommandIcon } from "lucide-react"

const data = {
  user: {
    name: "Quality Ops",
    email: "manex@vitruvius.ai",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Investigations",
      url: "/",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Analytics",
      url: "/dashboard",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      title: "Actions",
      url: "/issues/supplier_material/actions",
      icon: (
        <ClipboardListIcon
        />
      ),
    },
    {
      title: "Stakeholders",
      url: "/issues/supplier_material/brief",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Traceability Graph",
      url: "/issues/supplier_material",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "Manager Briefs",
      url: "/issues/supplier_material/brief",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
    {
      name: "Copilot Drafts",
      url: "/issues/supplier_material/copilot",
      icon: (
        <BotIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-[#d7deea]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! rounded-[8px]"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Quality Copilot</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-[#d7deea]">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
