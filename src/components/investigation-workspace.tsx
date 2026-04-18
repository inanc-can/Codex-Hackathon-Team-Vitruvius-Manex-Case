"use client";

import { useMemo, useState } from "react";

import { ActionForm } from "@/components/action-form";
import { BomTraceabilityPanel } from "@/components/bom-traceability";
import { ParetoChartPanel } from "@/components/charts/pareto-chart";
import { FaultTreePanel } from "@/components/fault-tree";
import { StakeholderLens } from "@/components/stakeholder-lens";
import { TimelinePanel } from "@/components/timeline";
import { Badge, KpiTile, Panel, SectionTitle, severityTone } from "@/components/ui";
import type { CopilotResponse, IssueDetail, RawClaim, RawDefect, TimelineEvent } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function InvestigationWorkspace({
  issue,
  draft,
}: {
  issue: IssueDetail;
  draft: CopilotResponse;
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedTimelineType, setSelectedTimelineType] =
    useState<TimelineEvent["type"] | null>(null);

  const filtered = useMemo(() => {
    const defects = issue.evidence.defects.filter((defect) => {
      const matchesCode = !selectedCode || defect.defect_code === selectedCode;
      const matchesPart = !selectedPart || defect.reported_part_number === selectedPart;
      const matchesNode =
        !selectedNode ||
        (selectedNode === "Supplier / Material" &&
          (defect.reported_part_number === "PM-00008" ||
            defect.reported_part_number === "PM-00015")) ||
        (selectedNode === "Process / Calibration" &&
          (defect.defect_code === "VIB_FAIL" ||
            defect.detected_test_name?.includes("VIB"))) ||
        (selectedNode === "Design Weakness" && defect.article_id === "ART-00001") ||
        (selectedNode === "Operator / Handling" &&
          ["VISUAL_SCRATCH", "LABEL_MISALIGN"].includes(defect.defect_code ?? ""));

      return matchesCode && matchesPart && matchesNode;
    });

    const claims = issue.evidence.claims.filter((claim) => {
      const matchesPart = !selectedPart || claim.reported_part_number === selectedPart;
      const matchesNode =
        !selectedNode ||
        (selectedNode === "Supplier / Material" && claim.reported_part_number === "PM-00008") ||
        (selectedNode === "Design Weakness" && claim.reported_part_number === "PM-00015");
      return matchesPart && matchesNode;
    });

    const timelineEvents = selectedTimelineType
      ? issue.timelineEvents.filter((event) => event.type === selectedTimelineType)
      : issue.timelineEvents;

    return { defects, claims, timelineEvents };
  }, [
    issue.evidence.claims,
    issue.evidence.defects,
    issue.timelineEvents,
    selectedCode,
    selectedNode,
    selectedPart,
    selectedTimelineType,
  ]);

  const suggestedOwners = useMemo(() => {
    const owners = [
      ...issue.evidence.rework.map((item) => item.user_id).filter(Boolean),
      ...issue.evidence.actions.map((item) => item.user_id).filter(Boolean),
      "user_017",
      "user_023",
      "user_042",
    ];
    return Array.from(new Set(owners)) as string[];
  }, [issue.evidence.actions, issue.evidence.rework]);

  return (
    <div className="space-y-8">
      <Panel className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={severityTone(issue.card.severity)}>{issue.card.severity} issue</Badge>
              <Badge tone="muted">{issue.card.confidence}</Badge>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-[#0B5FFF]">
                Shared investigation workspace
              </p>
              <h2 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#0f172a]">
                {issue.card.title}
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[#4b5563]">
                {issue.card.impactSummary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {issue.card.primaryStakeholders.map((stakeholder) => (
                <Badge key={stakeholder} tone="muted">
                  {stakeholder}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {issue.overviewMetrics.map((metric) => (
              <KpiTile
                key={metric.label}
                label={metric.label}
                value={metric.value}
                hint={metric.hint}
                tone={metric.tone}
              />
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FaultTreePanel
          nodes={issue.evidence.faultTree}
          selectedNode={selectedNode}
          onSelect={setSelectedNode}
        />
        <ParetoChartPanel
          data={issue.evidence.pareto}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
        />
      </div>

      <TimelinePanel
        events={issue.timelineEvents}
        selectedType={selectedTimelineType}
        onSelect={setSelectedTimelineType}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <BomTraceabilityPanel
          tree={issue.evidence.traceabilityTree}
          selectedPart={selectedPart}
          onSelect={setSelectedPart}
        />
        <div className="space-y-6">
          <Panel>
            <SectionTitle
              eyebrow="Evidence"
              title="Evidence cards"
              body="Engineers should not leave the page to gather the facts."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedNode ? <Badge tone="default">Fault tree: {selectedNode}</Badge> : null}
              {selectedCode ? <Badge tone="alert">Pareto filter: {selectedCode}</Badge> : null}
              {selectedPart ? <Badge tone="success">Traceability: {selectedPart}</Badge> : null}
              {selectedTimelineType ? (
                <Badge tone="muted">Timeline: {selectedTimelineType}</Badge>
              ) : null}
            </div>
            <div className="mt-5 space-y-4">
              {filtered.defects.slice(0, 4).map((defect) => (
                <EvidenceDefectCard key={defect.defect_id} defect={defect} />
              ))}
              {filtered.claims.slice(0, 3).map((claim) => (
                <EvidenceClaimCard key={claim.field_claim_id} claim={claim} />
              ))}
              {!filtered.defects.length && !filtered.claims.length ? (
                <div className="rounded-[12px] border border-dashed border-[#d7deea] p-5 text-sm text-[#5b6474]">
                  No cards match the current cross-filter. Clear a visual filter to widen the evidence bundle.
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              eyebrow="Caveats"
              title="Confidence and bias checks"
              body="Keep symptom, evidence, and inference separate."
            />
            <div className="mt-4 space-y-3">
              {issue.evidence.biasChecks.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-[12px] p-4 text-sm leading-6 ${
                    item.status === "watch"
                      ? "bg-amber-50 text-amber-900"
                      : "bg-emerald-50 text-emerald-900"
                  }`}
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <StakeholderLens views={issue.stakeholderViews} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <SectionTitle
            eyebrow="AI preview"
            title="Copilot preview"
            body="Grounded narrative blocks replace the dead folder report."
          />
          <div className="mt-4 space-y-4">
            <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[12px] font-medium text-slate-500">Problem statement</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{draft.problemStatement}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {draft.hypotheses.slice(0, 2).map((hypothesis) => (
                <div
                  key={hypothesis.title}
                  className="rounded-[12px] border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-[12px] font-medium text-slate-500">{hypothesis.confidence} confidence</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {hypothesis.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {hypothesis.rationale}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[12px] bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <strong>Confidence note:</strong> {draft.confidenceNote}
            </div>
          </div>
        </Panel>
        <Panel>
          <SectionTitle
            eyebrow="Closed-loop workflow"
            title="Quick action creation"
            body="Create a tracked initiative directly from the active investigation."
          />
          <div className="mt-4">
            <ActionForm
              issueId={issue.card.id}
              productId={issue.card.anchorProductId}
              defectId={issue.card.anchorDefectId}
              suggestedOwners={suggestedOwners}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function EvidenceDefectCard({ defect }: { defect: RawDefect }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="alert">{defect.defect_code ?? "Defect"}</Badge>
        <Badge tone="muted">{defect.severity}</Badge>
        <p className="text-xs text-slate-500">{formatDate(defect.defect_ts)}</p>
      </div>
      <p className="mt-3 text-base font-semibold text-slate-950">
        {defect.article_name} · {defect.product_id}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {defect.notes ?? "No additional defect note available."}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-medium">Section context</p>
          <p className="mt-1">
            Detected at {defect.detected_section_name ?? "unknown"} · Occurred at{" "}
            {defect.occurrence_section_name ?? "unknown"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-medium">Test evidence</p>
          <p className="mt-1">
            {defect.detected_test_name ?? "No linked test"} ·{" "}
            {defect.detected_test_overall ?? "n/a"} · {defect.detected_test_value ?? "n/a"}{" "}
            {defect.detected_test_unit ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function EvidenceClaimCard({ claim }: { claim: RawClaim }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="success">Field claim</Badge>
        <Badge tone="muted">{claim.market ?? "n/a"}</Badge>
        <p className="text-xs text-slate-500">{formatDate(claim.claim_ts)}</p>
      </div>
      <p className="mt-3 text-base font-semibold text-slate-950">
        {claim.article_name} · {claim.product_id}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {claim.complaint_text ?? "No complaint text available."}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-medium">Lag from build</p>
          <p className="mt-1">{claim.days_from_build ?? "n/a"} days</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-medium">Visible cost</p>
          <p className="mt-1">{formatCurrency(claim.cost)}</p>
        </div>
      </div>
      {claim.image_url ? (
        <div className="mt-3 overflow-hidden rounded-[12px] border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={claim.image_url}
            alt={`${claim.field_claim_id} evidence`}
            className="h-40 w-full object-cover"
            onError={(event) => {
              const target = event.currentTarget;
              target.style.display = "none";
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
