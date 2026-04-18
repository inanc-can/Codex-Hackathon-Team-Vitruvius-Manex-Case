import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader({
  title = "Manufacturing quality dashboard",
  description = "Official shadcn dashboard-01 adapted to the quality-copilot project",
}: {
  title?: string
  description?: string
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#d7deea] bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-3 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div>
          <h1 className="font-[var(--font-headline)] text-base font-semibold text-[#0f172a]">{title}</h1>
          <p className="text-xs text-[#5b6474]">{description}</p>
        </div>
      </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center rounded-[8px] border border-[#b9e4da] bg-[#edf8f5] px-2.5 py-1 text-[12px] font-medium text-[#005B4A]">
            ERP + MES live
          </span>
          <span className="inline-flex items-center rounded-[8px] border border-[#d7deea] bg-[#eef2f7] px-2.5 py-1 text-[12px] font-medium text-[#5b6474]">
            Audit trail locked
          </span>
        </div>
      </div>
    </header>
  )
}
