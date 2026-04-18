import type { CopilotResponse, IssueDetail } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function buildCopilotDraft(issue: IssueDetail): CopilotResponse {
  const supported = issue.evidence.faultTree
    .filter((node) => node.state === "supported")
    .map((node) => node.label);
  const totalCost =
    issue.evidence.defects.reduce((sum, defect) => sum + (defect.cost ?? 0), 0) +
    issue.evidence.claims.reduce((sum, claim) => sum + (claim.cost ?? 0), 0);

  const evidence = [
    `${issue.card.affectedProducts} affected products linked to ${issue.card.title.toLowerCase()}.`,
    `${issue.card.affectedClaims} connected field claims in the current story window.`,
    `${issue.evidence.pareto[0]?.code ?? "Primary pattern"} is the leading signal inside this issue cluster.`,
    `${issue.managerBrief.containmentStatus} and ${issue.evidence.actions.length} action(s) already visible in the workflow.`,
  ];

  return {
    problemStatement: `${issue.card.title} is acting as a cross-functional quality event rather than a standalone defect. The current signal suggests ${issue.card.currentHypothesis.toLowerCase()}, with impact spanning shopfloor evidence, traceability, and downstream reporting.`,
    hypotheses: issue.evidence.faultTree.map((node) => ({
      title: node.label,
      confidence:
        node.state === "supported"
          ? "high"
          : node.state === "weakly_supported"
            ? "medium"
            : node.state === "contradicted"
              ? "low"
              : "unknown",
      rationale: node.summary,
    })),
    supportingEvidence: evidence,
    missingEvidence: [
      "Formal engineering confirmation of the lead hypothesis is still required before final closure.",
      "Image evidence is best-effort because the shared image host may return missing assets for some rows.",
      "The app surfaces detection bias and near-miss context, but a human still needs to confirm whether they are causal or incidental.",
    ],
    containmentActions: [
      `Contain affected scope immediately across the ${supported[0] ?? "primary"} branch.`,
      "Use the stakeholder views to align Production, Supplier Quality, and Quality Engineering on the same fact base.",
      "Track all containment actions as visible product_action items so the issue does not disappear into a static document.",
    ],
    correctiveActions: [
      "Convert the supported hypothesis into owner-assigned corrective actions with explicit status.",
      "Validate the hypothesis against traceability, timeline, and field evidence before closing.",
      "Capture the final learning in the shared issue workspace so recurrence does not start from zero.",
    ],
    stakeholderImpact: issue.stakeholderViews.map(
      (view) =>
        `${view.stakeholder}: ${view.recommendedNextSteps[0] ?? "Review the shared issue evidence."}`,
    ),
    managerSummary: `${issue.managerBrief.impactHeadline} Current visible exposure is ${formatCurrency(totalCost)} across defects and claims, with ${issue.evidence.actions.length} tracked actions and a ${issue.managerBrief.riskLevel.toLowerCase()} risk posture.`,
    confidenceNote:
      "This draft is grounded in the connected Manex evidence bundle. It distinguishes observed signals from inferred root cause, but final confirmation remains a human engineering decision.",
  };
}
