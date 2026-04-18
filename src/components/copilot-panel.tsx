import type { CopilotResponse } from "@/lib/types";
import { Panel, SectionTitle } from "@/components/ui";

export function CopilotPanel({ draft }: { draft: CopilotResponse }) {
  return (
    <Panel>
      <SectionTitle
        eyebrow="Intelligent generation"
        title="Grounded copilot draft"
        body="Narrative output stays grounded in the shared evidence bundle and keeps uncertainty visible."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-[12px] font-medium text-slate-500">Problem statement</p>
            <p className="mt-3 text-sm leading-7">{draft.problemStatement}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {draft.hypotheses.map((hypothesis) => (
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
        </div>
        <div className="space-y-4">
          {[
            { label: "Supporting evidence", items: draft.supportingEvidence },
            { label: "Missing evidence", items: draft.missingEvidence },
            { label: "Containment actions", items: draft.containmentActions },
            { label: "Corrective actions", items: draft.correctiveActions },
          ].map(({ label, items }) => (
            <div
              key={label}
              className="rounded-[12px] border border-slate-200 bg-white p-4"
            >
              <p className="text-[12px] font-medium text-slate-500">{label}</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-[12px] bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Confidence note:</strong> {draft.confidenceNote}
      </div>
    </Panel>
  );
}
