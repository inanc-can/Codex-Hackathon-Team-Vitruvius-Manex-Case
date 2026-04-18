import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { Badge, buttonClassName } from "@/components/ui"
import type { IssueCard } from "@/lib/types"
import { humanizeToken } from "@/lib/utils"
import Link from "next/link"

export function DashboardOverview({
  issues,
}: {
  issues: IssueCard[]
}) {
  const totalProducts = issues.reduce((sum, issue) => sum + issue.affectedProducts, 0)
  const totalClaims = issues.reduce((sum, issue) => sum + issue.affectedClaims, 0)
  const priorityIssues = issues.filter(
    (issue) => issue.severity === "critical" || issue.severity === "high"
  ).length
  const stakeholderLenses = new Set(
    issues.flatMap((issue) => issue.primaryStakeholders)
  ).size

  const tableData = issues.map((issue, index) => ({
    id: index + 1,
    header: issue.title,
    type: humanizeToken(issue.storyType),
    status:
      issue.severity === "critical"
        ? "Escalated"
        : issue.severity === "high"
          ? "In Process"
          : "Monitoring",
    target: String(issue.affectedProducts),
    limit: String(issue.affectedClaims),
    reviewer: issue.primaryStakeholders[0] ?? "Assign owner",
  }))
  const heroIssueId = issues[0]?.id ?? "supplier_material"

  return (
    <>
      <div className="px-4 lg:px-6">
        <section className="rounded-[12px] border border-[#d7deea] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="muted">Quality Dashboard</Badge>
                <Badge tone="default">Manufacturing operations</Badge>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a]">
                  Investigation command center
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-[#5b6474]">
                  Track issue exposure, review investigation lanes, and move from shared evidence to corrective action without leaving the workspace.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/issues/${heroIssueId}/actions`}
                className={buttonClassName({ variant: "secondary" })}
              >
                Review action queue
              </Link>
              <Link href={`/issues/${heroIssueId}`} className={buttonClassName()}>
                Open investigation
              </Link>
            </div>
          </div>
        </section>
      </div>
      <SectionCards
        totalProducts={totalProducts}
        totalClaims={totalClaims}
        priorityIssues={priorityIssues}
        stakeholderLenses={stakeholderLenses}
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={tableData} />
    </>
  )
}
