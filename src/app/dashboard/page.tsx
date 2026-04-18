import { DashboardAppFrame } from "@/components/dashboard-app-frame"
import { DashboardOverview } from "@/components/dashboard-overview"
import { getIssues } from "@/lib/manex"

export default async function Page() {
  const issues = await getIssues()

  return (
    <DashboardAppFrame
      title="Manufacturing quality dashboard"
      description="Official shadcn dashboard-01 adapted to the quality-copilot project"
    >
      <DashboardOverview issues={issues} />
    </DashboardAppFrame>
  )
}
