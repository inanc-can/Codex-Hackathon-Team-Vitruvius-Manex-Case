import { QualityDashboardSections } from "@/components/quality-dashboard-sections";
import { getIssues } from "@/lib/manex";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const issues = await getIssues();
  const totalProducts = issues.reduce((sum, issue) => sum + issue.affectedProducts, 0);
  const totalClaims = issues.reduce((sum, issue) => sum + issue.affectedClaims, 0);
  const stakeholderLenses = new Set(issues.flatMap((issue) => issue.primaryStakeholders)).size;
  const heroIssueId = issues[0]?.id ?? "supplier_material";

  return (
    <>
      <QualityDashboardSections
        issues={issues}
        totalProducts={totalProducts}
        totalClaims={totalClaims}
        stakeholderLenses={stakeholderLenses}
        heroIssueHref={`/issues/${heroIssueId}`}
        heroActionHref={`/issues/${heroIssueId}/actions`}
      />
    </>
  );
}
