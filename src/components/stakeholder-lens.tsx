"use client";

import { startTransition, useState } from "react";

import type { StakeholderView } from "@/lib/types";
import { Panel, SectionTitle, chipClassName } from "@/components/ui";

export function StakeholderLens({
  views,
}: {
  views: StakeholderView[];
}) {
  const [active, setActive] = useState(views[0]?.stakeholder ?? "");
  const view = views.find((item) => item.stakeholder === active) ?? views[0];

  if (!view) {
    return null;
  }

  return (
    <Panel>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionTitle
          eyebrow="Stakeholder workflow"
          title="Stakeholder lens"
          body="Switch perspective without leaving the issue. Everyone sees the same evidence, but the guidance shifts to their operational problem."
        />
        <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
          {views.map((item) => (
            <button
              key={item.stakeholder}
              type="button"
              onClick={() =>
                startTransition(() => {
                  setActive(item.stakeholder);
                })
              }
              aria-pressed={item.stakeholder === active}
              className={chipClassName(item.stakeholder === active)}
            >
              {item.stakeholder}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[12px] bg-slate-50 p-4">
          <p className="text-[12px] font-medium text-slate-500">Goals</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
            {view.goals.map((goal) => (
              <li key={goal}>• {goal}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[12px] bg-rose-50 p-4">
          <p className="text-[12px] font-medium text-rose-600">Current pain</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-rose-700">
            {view.currentPain.map((pain) => (
              <li key={pain}>• {pain}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[12px] bg-emerald-50 p-4">
          <p className="text-[12px] font-medium text-emerald-600">Recommended next step</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-emerald-700">
            {view.recommendedNextSteps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
