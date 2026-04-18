import type {
  BiasCheck,
  CreateActionInput,
  FaultNode,
  IssueCard,
  IssueDetail,
  KpiCard,
  ManagerBrief,
  ParetoItem,
  RawAction,
  RawClaim,
  RawDefect,
  RawQualitySummary,
  RawRework,
  RawTraceability,
  Stakeholder,
  StakeholderView,
  StoryType,
  TraceabilityNode,
} from "@/lib/types";
import {
  formatCurrency,
  formatInt,
  formatRelativeWindow,
  unique,
} from "@/lib/utils";

const STORY_ORDER: StoryType[] = [
  "supplier_material",
  "process_drift",
  "design_weakness",
  "operator_handling",
];

type StoryConfig = {
  id: StoryType;
  title: string;
  severity: "medium" | "high" | "critical";
  summary: string;
  currentHypothesis: string;
  impactTemplate: string;
  stakeholders: Stakeholder[];
  defectPredicate: (item: RawDefect) => boolean;
  claimPredicate: (item: RawClaim) => boolean;
  reworkPredicate: (
    item: RawRework,
    context: { productIds: Set<string>; defectIds: Set<string> },
  ) => boolean;
  traceabilityHighlight: (item: RawTraceability) => boolean;
  timelineHint: string;
  faultTree: Array<{ label: string; state: FaultNode["state"]; summary: string }>;
  stakeholderViews: StakeholderView[];
  biasChecks: BiasCheck[];
  managerBrief: (params: {
    affectedProducts: number;
    affectedClaims: number;
    actions: number;
  }) => ManagerBrief;
};

const STORY_CONFIGS: StoryConfig[] = [
  {
    id: "supplier_material",
    title: "Supplier Material Incident",
    severity: "critical",
    summary:
      "Cold-solder failures on MC-200 are clustering around capacitor evidence, field claims, and supplier-linked installed parts.",
    currentHypothesis:
      "Supplier material quality is driving a capacitor-led cold-solder incident",
    impactTemplate:
      "Supplier-linked failures are now visible across shopfloor defects and field claims.",
    stakeholders: [
      "Quality Engineer",
      "Supplier Quality Engineer",
      "Field Service / Customer Quality",
      "Quality Manager / Plant Manager",
    ],
    defectPredicate: (item) =>
      item.defect_code === "SOLDER_COLD" && item.reported_part_number === "PM-00008",
    claimPredicate: (item) =>
      item.article_id === "ART-00001" && item.reported_part_number === "PM-00008",
    reworkPredicate: (item, context) =>
      context.productIds.has(item.product_id) || context.defectIds.has(item.defect_id),
    traceabilityHighlight: (item) =>
      item.part_number === "PM-00008" || item.find_number === "C12",
    timelineHint: "Thermal-cycling claims appear after the shopfloor spike.",
    faultTree: [
      {
        label: "Supplier / Material",
        state: "supported",
        summary:
          "Installed-part lineage and downstream claims support a supplier-linked capacitor incident.",
      },
      {
        label: "Process / Calibration",
        state: "weakly_supported",
        summary:
          "Process conditions still matter, but they do not explain the field-claim lag as well as the supplier signal.",
      },
      {
        label: "Design Weakness",
        state: "unknown",
        summary:
          "Design evidence is not the primary signal in this cluster, but it cannot be fully ruled out without engineering review.",
      },
      {
        label: "Operator / Handling",
        state: "contradicted",
        summary:
          "The issue pattern is not localized to a packaging or handling behavior.",
      },
    ],
    stakeholderViews: [
      {
        stakeholder: "Quality Engineer",
        goals: [
          "Frame the issue quickly without opening a static 8D template.",
          "Show why this is a systemic event rather than a single defect.",
        ],
        currentPain: [
          "Manual evidence gathering across defects, claims, and supplier data.",
          "Repeated management updates before the evidence is consolidated.",
        ],
        recommendedNextSteps: [
          "Confirm the supplier/material branch in the fault tree and create containment actions.",
          "Use the traceability explorer to scope which installed products are affected.",
        ],
        relevantEvidenceRefs: ["fault-tree", "timeline", "traceability"],
      },
      {
        stakeholder: "Supplier Quality Engineer",
        goals: [
          "Prepare a supplier-facing escalation with clear batch and part evidence.",
        ],
        currentPain: [
          "Escalations often arrive with weak traceability and little visual context.",
        ],
        recommendedNextSteps: [
          "Review highlighted C12 lineage and batch distribution before contacting the supplier.",
        ],
        relevantEvidenceRefs: ["traceability", "claims", "images"],
      },
      {
        stakeholder: "Field Service / Customer Quality",
        goals: ["Show customer impact and claim lag in the same workspace."],
        currentPain: [
          "Warranty complaints rarely connect cleanly to plant-side evidence.",
        ],
        recommendedNextSteps: [
          "Use the timeline to explain the lag between build and claim to the customer-facing team.",
        ],
        relevantEvidenceRefs: ["timeline", "claims"],
      },
      {
        stakeholder: "Quality Manager / Plant Manager",
        goals: ["Understand cost, exposure, and action progress in one glance."],
        currentPain: [
          "Leadership typically receives dead reports instead of live issue status.",
        ],
        recommendedNextSteps: [
          "Use the manager brief to align containment urgency with supplier escalation.",
        ],
        relevantEvidenceRefs: ["manager-brief", "actions"],
      },
    ],
    biasChecks: [
      {
        title: "Detection hotspot bias",
        status: "watch",
        detail:
          "A large share of defects is still detected at Pruefung stations. Treat that as a detection gate, not automatic causation.",
      },
      {
        title: "Field lag is meaningful",
        status: "good",
        detail:
          "Claims arrive weeks after build, which strengthens the case for a deeper supplier-linked issue rather than a one-off handling error.",
      },
    ],
    managerBrief: ({ affectedProducts, affectedClaims, actions }) => ({
      impactHeadline: `${affectedProducts} products and ${affectedClaims} claims are tied to a supplier-led failure pattern.`,
      riskLevel: "Critical",
      decisionNeeded:
        "Decide whether to escalate supplier containment immediately and block similar outgoing units.",
      containmentStatus:
        actions > 0 ? "Containment work is visible in tracked actions." : "Containment has not yet been formalized in the workflow.",
      unresolvedQuestions: [
        "Is the currently observed batch distribution enough to justify supplier-wide escalation?",
        "Which downstream units still need proactive customer communication?",
      ],
    }),
  },
  {
    id: "process_drift",
    title: "Process Drift Investigation",
    severity: "high",
    summary:
      "Vibration-related failures cluster in a narrow time window and point toward station-specific process drift rather than a broad product issue.",
    currentHypothesis:
      "Process calibration drift is causing vibration failures around Montage Linie 1",
    impactTemplate:
      "A contained but meaningful process drift pattern is visible in the production timeline.",
    stakeholders: [
      "Quality Engineer",
      "Process Engineer",
      "Production / Operations",
      "Quality Manager / Plant Manager",
    ],
    defectPredicate: (item) =>
      item.defect_code === "VIB_FAIL" ||
      item.detected_test_name?.includes("VIB") === true,
    claimPredicate: () => false,
    reworkPredicate: (item, context) => context.defectIds.has(item.defect_id),
    traceabilityHighlight: () => false,
    timelineHint: "The signal is concentrated in late 2025 and then falls away.",
    faultTree: [
      {
        label: "Supplier / Material",
        state: "contradicted",
        summary:
          "The issue is concentrated in time and section behavior, not supplier lineage.",
      },
      {
        label: "Process / Calibration",
        state: "supported",
        summary:
          "The strongest evidence is a tight production-window cluster linked to vibration failures and rework behavior.",
      },
      {
        label: "Design Weakness",
        state: "weakly_supported",
        summary:
          "A design gap is less plausible because the signal self-corrects after the narrow time window.",
      },
      {
        label: "Operator / Handling",
        state: "unknown",
        summary:
          "Human factors are possible but not the dominant story in the current evidence bundle.",
      },
    ],
    stakeholderViews: [
      {
        stakeholder: "Quality Engineer",
        goals: ["Prove the issue is time-bounded and not random noise."],
        currentPain: [
          "Time-window diagnosis is slow when defect and test evidence live in separate systems.",
        ],
        recommendedNextSteps: [
          "Use the timeline and Pareto together to confirm the narrow VIB_FAIL cluster.",
        ],
        relevantEvidenceRefs: ["timeline", "pareto"],
      },
      {
        stakeholder: "Process Engineer",
        goals: ["Validate a calibration or torque drift hypothesis quickly."],
        currentPain: [
          "Process teams are often asked to defend or refute a hypothesis without a shared chronology.",
        ],
        recommendedNextSteps: [
          "Cross-check rework actions and section clustering to validate calibration drift.",
        ],
        relevantEvidenceRefs: ["timeline", "rework"],
      },
      {
        stakeholder: "Production / Operations",
        goals: ["Understand whether line behavior needs intervention now."],
        currentPain: [
          "Line teams often wait on quality updates without knowing if current output is still exposed.",
        ],
        recommendedNextSteps: [
          "Review the containment state and current exposure before changing line operations.",
        ],
        relevantEvidenceRefs: ["manager-brief", "actions"],
      },
    ],
    biasChecks: [
      {
        title: "Seasonal dip caution",
        status: "watch",
        detail:
          "Production volume dips around the holidays; do not confuse lower output with a resolved root cause.",
      },
      {
        title: "Time-boxed signal",
        status: "good",
        detail:
          "The defect cluster is tightly scoped in time, which is typical of process drift rather than a broad design issue.",
      },
    ],
    managerBrief: ({ affectedProducts, actions }) => ({
      impactHeadline: `${affectedProducts} products show a contained process-drift pattern with a narrow time window.`,
      riskLevel: "High",
      decisionNeeded:
        "Decide whether a formal calibration review and retrospective line audit are required.",
      containmentStatus:
        actions > 0 ? "Containment and follow-up are visible in the tracked action list." : "No formal corrective action has been logged yet.",
      unresolvedQuestions: [
        "Was the process self-correcting, or did the factory already intervene off-system?",
        "Do similar near-miss signals still exist in current output?",
      ],
    }),
  },
  {
    id: "design_weakness",
    title: "Design Weakness Escalation",
    severity: "high",
    summary:
      "MC-200 field claims are emerging without matching in-factory defects, suggesting a latent design weakness rather than a shopfloor escape alone.",
    currentHypothesis:
      "A latent design weakness around R33 / PM-00015 is driving field-only failures",
    impactTemplate:
      "Customer-visible failures are escaping factory controls and pointing back to the product design.",
    stakeholders: [
      "Quality Engineer",
      "R&D / Design Engineer",
      "Field Service / Customer Quality",
      "Quality Manager / Plant Manager",
    ],
    defectPredicate: () => false,
    claimPredicate: (item) =>
      item.article_id === "ART-00001" &&
      item.reported_part_number === "PM-00015" &&
      !item.mapped_defect_id,
    reworkPredicate: () => false,
    traceabilityHighlight: (item) =>
      item.part_number === "PM-00015" || item.find_number === "R33",
    timelineHint: "The field-only pattern appears after customer usage, not during production tests.",
    faultTree: [
      {
        label: "Supplier / Material",
        state: "unknown",
        summary:
          "Supplier influence is possible, but current evidence points more strongly to a latent design path.",
      },
      {
        label: "Process / Calibration",
        state: "contradicted",
        summary:
          "No in-factory defect cluster supports a process-drift explanation.",
      },
      {
        label: "Design Weakness",
        state: "supported",
        summary:
          "Field-only claims, part identity, and BOM position all point to a latent design weakness.",
      },
      {
        label: "Operator / Handling",
        state: "contradicted",
        summary:
          "The signal is customer-use dependent and not localized to handling or packaging behavior.",
      },
    ],
    stakeholderViews: [
      {
        stakeholder: "Quality Engineer",
        goals: ["Explain why customer failures matter even without factory defect records."],
        currentPain: [
          "Field-only failures are hard to bring into the same narrative as plant quality work.",
        ],
        recommendedNextSteps: [
          "Use the field-only timeline and BOM traceability to create a compelling escalation package for engineering.",
        ],
        relevantEvidenceRefs: ["timeline", "claims", "traceability"],
      },
      {
        stakeholder: "R&D / Design Engineer",
        goals: ["Assess whether the design itself is vulnerable under real usage."],
        currentPain: [
          "Engineering teams often receive complaint text without connected product context.",
        ],
        recommendedNextSteps: [
          "Inspect highlighted R33 lineage and field-only evidence before closing out the design branch.",
        ],
        relevantEvidenceRefs: ["fault-tree", "traceability"],
      },
      {
        stakeholder: "Field Service / Customer Quality",
        goals: ["Summarize customer impact with stronger engineering context."],
        currentPain: [
          "Customer complaints are often handled operationally without influencing design decisions quickly enough.",
        ],
        recommendedNextSteps: [
          "Use the manager brief to align customer communication with engineering review timing.",
        ],
        relevantEvidenceRefs: ["claims", "manager-brief"],
      },
    ],
    biasChecks: [
      {
        title: "No in-factory defects",
        status: "good",
        detail:
          "The absence of plant defects is itself an important signal here rather than a reason to dismiss the issue.",
      },
      {
        title: "Field evidence only",
        status: "watch",
        detail:
          "The issue still needs engineering confirmation because the strongest evidence appears post-ship rather than at controlled test stations.",
      },
    ],
    managerBrief: ({ affectedProducts, affectedClaims, actions }) => ({
      impactHeadline: `${affectedClaims} field claims on ${affectedProducts} products point to a design-led escape.`,
      riskLevel: "High",
      decisionNeeded:
        "Decide whether design engineering must open a formal corrective workstream beyond local containment.",
      containmentStatus:
        actions > 0 ? "The cross-functional review is visible in the workflow." : "No formal design-response action is visible yet.",
      unresolvedQuestions: [
        "Should the team trigger a design review even though the plant has no matching defect history?",
        "Is a customer communication or service advisory required before final engineering closure?",
      ],
    }),
  },
  {
    id: "operator_handling",
    title: "Operator Handling Pattern",
    severity: "medium",
    summary:
      "Low-severity cosmetic defects are clustering around a small set of orders and rework behaviors, suggesting localized handling issues.",
    currentHypothesis:
      "Localized operator handling is driving recurring cosmetic defects on a few production orders",
    impactTemplate:
      "The pattern is low-severity but operationally visible and avoidable.",
    stakeholders: [
      "Quality Engineer",
      "Production / Operations",
      "Quality Manager / Plant Manager",
    ],
    defectPredicate: (item) =>
      ["PO-00012", "PO-00018", "PO-00024"].includes(item.order_id ?? "") ||
      (["VISUAL_SCRATCH", "LABEL_MISALIGN"].includes(item.defect_code ?? "") &&
        item.severity === "low"),
    claimPredicate: () => false,
    reworkPredicate: (item, context) =>
      item.user_id === "user_042" ||
      context.productIds.has(item.product_id) ||
      context.defectIds.has(item.defect_id),
    traceabilityHighlight: () => false,
    timelineHint: "The pattern is concentrated on a few production orders rather than spread across the fleet.",
    faultTree: [
      {
        label: "Supplier / Material",
        state: "contradicted",
        summary:
          "The pattern is cosmetic and localized to production behavior rather than incoming material quality.",
      },
      {
        label: "Process / Calibration",
        state: "weakly_supported",
        summary:
          "Process conditions matter, but the cluster is more consistent with handling than calibration drift.",
      },
      {
        label: "Design Weakness",
        state: "contradicted",
        summary:
          "No latent design pattern is required to explain the observed cosmetic issue cluster.",
      },
      {
        label: "Operator / Handling",
        state: "supported",
        summary:
          "Order clustering and rework-user linkage point toward a localized handling issue.",
      },
    ],
    stakeholderViews: [
      {
        stakeholder: "Quality Engineer",
        goals: ["Resolve recurring cosmetic issues without over-escalating them."],
        currentPain: [
          "Low-severity issues still consume time when there is no clear ownership or localized pattern view.",
        ],
        recommendedNextSteps: [
          "Use order clustering and rework evidence to keep the response targeted and operational.",
        ],
        relevantEvidenceRefs: ["pareto", "timeline", "rework"],
      },
      {
        stakeholder: "Production / Operations",
        goals: ["Contain the issue with coaching and local process changes, not broad stoppages."],
        currentPain: [
          "Production teams often receive vague quality requests instead of precise, order-level guidance.",
        ],
        recommendedNextSteps: [
          "Review affected orders and rework-user context before applying corrective handling steps.",
        ],
        relevantEvidenceRefs: ["timeline", "actions"],
      },
      {
        stakeholder: "Quality Manager / Plant Manager",
        goals: ["Keep a low-severity issue from becoming a recurring cost and reputation drain."],
        currentPain: [
          "Minor issues still add up, but they rarely get operationally visible follow-through.",
        ],
        recommendedNextSteps: [
          "Track whether local corrective actions actually stop recurrence on the affected orders.",
        ],
        relevantEvidenceRefs: ["manager-brief", "actions"],
      },
    ],
    biasChecks: [
      {
        title: "Low severity does not mean no value",
        status: "good",
        detail:
          "This issue is not functionally critical, but it is a good test of whether the workflow can prevent avoidable recurrence.",
      },
    ],
    managerBrief: ({ affectedProducts, actions }) => ({
      impactHeadline: `${affectedProducts} products are involved in a localized cosmetic-defect pattern.`,
      riskLevel: "Medium",
      decisionNeeded:
        "Decide whether local handling coaching is enough or whether packaging controls need a broader adjustment.",
      containmentStatus:
        actions > 0 ? "The handling response is being tracked in the workflow." : "No formal follow-up is visible yet.",
      unresolvedQuestions: [
        "Is user-specific coaching sufficient, or is a broader packaging-process adjustment required?",
      ],
    }),
  },
];

type DataBundle = {
  defects: RawDefect[];
  claims: RawClaim[];
  traceability: RawTraceability[];
  rework: RawRework[];
  qualitySummary: RawQualitySummary[];
  actions: RawAction[];
};

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getImageUrl(path: string | null) {
  if (!path) {
    return null;
  }
  return `${process.env.MANEX_ASSETS_BASE_URL ?? ""}${path}`;
}

async function fetchManex<T>(path: string): Promise<T> {
  const response = await fetch(`${getEnv("MANEX_API_URL")}${path}`, {
    headers: {
      Authorization: `Bearer ${getEnv("MANEX_ANON_KEY")}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Manex request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getDataBundle(): Promise<DataBundle> {
  const [defects, claims, traceability, rework, qualitySummary, actions] =
    await Promise.all([
      fetchManex<RawDefect[]>("/v_defect_detail?limit=1000&order=defect_ts.desc"),
      fetchManex<RawClaim[]>("/v_field_claim_detail?limit=1000&order=claim_ts.desc"),
      fetchManex<RawTraceability[]>(
        "/v_product_bom_parts?limit=5000&order=installed_ts.desc",
      ),
      fetchManex<RawRework[]>("/rework?limit=1000&order=ts.desc"),
      fetchManex<RawQualitySummary[]>("/v_quality_summary?limit=1000&order=week_start.asc"),
      fetchManex<RawAction[]>("/product_action?limit=1000&order=ts.desc"),
    ]);

  return { defects, claims, traceability, rework, qualitySummary, actions };
}

function buildPareto(defects: RawDefect[]): ParetoItem[] {
  const counts = new Map<string, number>();
  defects.forEach((defect) => {
    const code = defect.defect_code ?? "UNSPECIFIED";
    counts.set(code, (counts.get(code) ?? 0) + 1);
  });
  const total = defects.length || 1;
  let running = 0;

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => {
      running += count;
      return {
        code,
        count,
        cumulative: Math.round((running / total) * 100),
      };
    });
}

function buildTraceabilityTree(rows: RawTraceability[]): TraceabilityNode[] {
  const groups = new Map<string, TraceabilityNode>();
  rows.forEach((row) => {
    const key = row.parent_find_number ?? "Assembly context unavailable";
    if (!groups.has(key)) {
      groups.set(key, {
        assembly: key,
        assemblyType: row.parent_node_type ?? "assembly",
        items: [],
      });
    }
    groups.get(key)?.items.push({
      productId: row.product_id,
      findNumber: row.find_number ?? row.position_code ?? "n/a",
      partNumber: row.part_number,
      partTitle: row.part_title,
      batchId: row.batch_id,
      supplierName: row.supplier_name,
      highlighted:
        row.find_number === "C12" || row.find_number === "R33" || row.part_number === "PM-00008" || row.part_number === "PM-00015",
    });
  });

  return Array.from(groups.values());
}

function buildTimelineEvents(
  defects: RawDefect[],
  claims: RawClaim[],
  rework: RawRework[],
  actions: RawAction[],
): IssueDetail["timelineEvents"] {
  const buildEvents = unique(
    [...defects, ...claims]
      .filter((item) => item.product_build_ts)
      .map((item) => `${item.product_id}|${item.product_build_ts}`),
  ).map((token) => {
    const [productId, date] = token.split("|");
    return {
      id: `build-${productId}`,
      date,
      type: "build" as const,
      title: "Product built",
      detail: `Product ${productId} entered the traceable product history.`,
      productId,
    };
  });

  return [
    ...buildEvents,
    ...defects.map((defect) => ({
      id: defect.defect_id,
      date: defect.defect_ts,
      type: "defect" as const,
      title: defect.defect_code ?? "Defect observed",
      detail: `${defect.article_name} at ${defect.detected_section_name ?? "unknown section"}`,
      productId: defect.product_id,
    })),
    ...claims.map((claim) => ({
      id: claim.field_claim_id,
      date: claim.claim_ts,
      type: "claim" as const,
      title: "Field claim",
      detail: claim.complaint_text?.slice(0, 120) ?? "Customer complaint recorded.",
      productId: claim.product_id,
    })),
    ...rework.map((item) => ({
      id: item.rework_id,
      date: item.ts,
      type: "rework" as const,
      title: "Rework action",
      detail: item.action_text ?? "Rework logged.",
      productId: item.product_id,
    })),
    ...actions.map((item) => ({
      id: item.action_id,
      date: item.ts,
      type: "action" as const,
      title: item.action_type,
      detail: item.comments ?? `Status: ${item.status}`,
      productId: item.product_id,
    })),
  ].toSorted((a, b) => +new Date(a.date) - +new Date(b.date));
}

function buildOverviewMetrics(card: IssueCard, defects: RawDefect[], claims: RawClaim[], actions: RawAction[]): KpiCard[] {
  const defectCost = defects.reduce((sum, defect) => sum + (defect.cost ?? 0), 0);
  const claimCost = claims.reduce((sum, claim) => sum + (claim.cost ?? 0), 0);
  const openActions = actions.filter((action) => action.status !== "done").length;

  return [
    {
      label: "Affected products",
      value: formatInt(card.affectedProducts),
      tone: "default",
      hint: "Products tied to the issue evidence bundle.",
    },
    {
      label: "Field claims",
      value: formatInt(card.affectedClaims),
      tone: card.affectedClaims ? "alert" : "default",
      hint: "Downstream claims visible inside the same investigation.",
    },
    {
      label: "Visible cost",
      value: formatCurrency(defectCost + claimCost),
      tone: "alert",
      hint: "Defect and claim cost visible in the current dataset.",
    },
    {
      label: "Open actions",
      value: formatInt(openActions),
      tone: openActions ? "success" : "default",
      hint: "Tracked product_action items still in flight.",
    },
  ];
}

function buildIssueCard(config: StoryConfig, bundle: DataBundle): IssueCard {
  const defects = bundle.defects.filter(config.defectPredicate);
  const claims = bundle.claims.filter(config.claimPredicate);
  const productIds = new Set([
    ...defects.map((item) => item.product_id),
    ...claims.map((item) => item.product_id),
  ]);
  const defectIds = new Set(defects.map((item) => item.defect_id));
  const actions = bundle.actions.filter(
    (action) =>
      productIds.has(action.product_id) ||
      (action.defect_id ? defectIds.has(action.defect_id) : false),
  );
  const timeWindow = formatRelativeWindow(
    [...defects.map((item) => item.defect_ts), ...claims.map((item) => item.claim_ts)].filter(
      Boolean,
    ),
  );
  const highlightedTraceability = bundle.traceability.filter(
    (row) => productIds.has(row.product_id) && config.traceabilityHighlight(row),
  );
  const topBatch = highlightedTraceability
    .map((row) => row.batch_id)
    .filter(Boolean)
    .reduce<Map<string, number>>((acc, batchId) => {
      acc.set(batchId!, (acc.get(batchId!) ?? 0) + 1);
      return acc;
    }, new Map());
  const batchLabel =
    Array.from(topBatch.entries()).toSorted((a, b) => b[1] - a[1])[0]?.[0] ?? "No dominant batch";

  return {
    id: config.id,
    storyType: config.id,
    title: config.title,
    severity: config.severity,
    summary: config.summary,
    primaryStakeholders: config.stakeholders,
    affectedProducts: productIds.size,
    affectedClaims: claims.length,
    timeWindow,
    confidence:
      config.faultTree.find((node) => node.state === "supported")?.label ??
      "Multiple hypotheses in play",
    anchorProductId: defects[0]?.product_id ?? claims[0]?.product_id ?? null,
    anchorDefectId: defects[0]?.defect_id ?? null,
    currentHypothesis: config.currentHypothesis,
    impactSummary:
      batchLabel && config.id === "supplier_material"
        ? `${config.impactTemplate} Dominant installed batch signal: ${batchLabel}.`
        : config.impactTemplate,
    kpis: [
      {
        label: "Products",
        value: formatInt(productIds.size),
      },
      {
        label: "Claims",
        value: formatInt(claims.length),
        tone: claims.length ? "alert" : "default",
      },
      {
        label: "Open actions",
        value: formatInt(actions.filter((action) => action.status !== "done").length),
        tone: actions.length ? "success" : "default",
      },
    ],
  };
}

export async function getIssues(): Promise<IssueCard[]> {
  const bundle = await getDataBundle();
  return STORY_ORDER.map((storyId) => {
    const config = STORY_CONFIGS.find((item) => item.id === storyId)!;
    return buildIssueCard(config, bundle);
  });
}

export async function getIssueDetail(issueId: StoryType): Promise<IssueDetail> {
  const bundle = await getDataBundle();
  const config = STORY_CONFIGS.find((item) => item.id === issueId);

  if (!config) {
    throw new Error(`Unknown issue id: ${issueId}`);
  }

  const card = buildIssueCard(config, bundle);
  const defects = bundle.defects.filter(config.defectPredicate);
  const claims = bundle.claims.filter(config.claimPredicate);
  const productIds = new Set([
    ...defects.map((item) => item.product_id),
    ...claims.map((item) => item.product_id),
  ]);
  const defectIds = new Set(defects.map((item) => item.defect_id));
  const traceability = bundle.traceability.filter((item) => productIds.has(item.product_id));
  const rework = bundle.rework.filter((item) =>
    config.reworkPredicate(item, { productIds, defectIds }),
  );
  const actions = bundle.actions.filter(
    (action) =>
      productIds.has(action.product_id) ||
      (action.defect_id ? defectIds.has(action.defect_id) : false),
  );
  const qualitySummary = bundle.qualitySummary.filter((item) =>
    unique([...defects.map((defect) => defect.article_id), ...claims.map((claim) => claim.article_id)]).includes(
      item.article_id,
    ),
  );

  const managerBrief = config.managerBrief({
    affectedProducts: card.affectedProducts,
    affectedClaims: card.affectedClaims,
    actions: actions.length,
  });

  return {
    card,
    overviewMetrics: buildOverviewMetrics(card, defects, claims, actions),
    timelineEvents: buildTimelineEvents(defects, claims, rework, actions),
    evidence: {
      defects: defects.map((item) => ({
        ...item,
        image_url: getImageUrl(item.image_url),
      })),
      claims: claims.map((item) => ({
        ...item,
        image_url: getImageUrl(item.image_url),
      })),
      traceability,
      rework: rework.map((item) => ({
        ...item,
        image_url: getImageUrl(item.image_url),
      })),
      qualitySummary,
      actions,
      pareto: buildPareto(defects),
      faultTree: config.faultTree.map((node, index) => ({
        id: `${config.id}-${index}`,
        label: node.label,
        state: node.state,
        evidenceCount:
          node.label === "Supplier / Material"
            ? traceability.filter(config.traceabilityHighlight).length
            : node.label === "Process / Calibration"
              ? defects.length
              : node.label === "Design Weakness"
                ? claims.length
                : rework.length,
        summary: node.summary,
      })),
      traceabilityTree: buildTraceabilityTree(traceability),
      biasChecks: config.biasChecks,
    },
    stakeholderViews: config.stakeholderViews,
    managerBrief,
  };
}

export async function getIssueActions(issueId: StoryType) {
  const detail = await getIssueDetail(issueId);
  return detail.evidence.actions;
}

export async function createIssueAction(issueId: StoryType, input: CreateActionInput) {
  const bundle = await getDataBundle();
  const maxId = bundle.actions.reduce((max, item) => {
    const numeric = Number(item.action_id.replace("PA-", ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 100);
  const actionId = `PA-${String(maxId + 1).padStart(5, "0")}`;

  const response = await fetch(`${getEnv("MANEX_API_URL")}/product_action`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnv("MANEX_ANON_KEY")}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      action_id: actionId,
      product_id: input.productId,
      ts: new Date().toISOString(),
      action_type: input.actionType,
      status: input.status,
      user_id: input.ownerUserId,
      section_id: input.sectionId ?? null,
      comments: input.comments,
      defect_id: input.defectId ?? null,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create action: ${response.status} ${text}`);
  }

  return response.json();
}
