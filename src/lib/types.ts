export type StoryType =
  | "supplier_material"
  | "process_drift"
  | "design_weakness"
  | "operator_handling";

export type Stakeholder =
  | "Quality Engineer"
  | "Production / Operations"
  | "Process Engineer"
  | "Supplier Quality Engineer"
  | "Field Service / Customer Quality"
  | "R&D / Design Engineer"
  | "Quality Manager / Plant Manager";

export type Severity = "low" | "medium" | "high" | "critical";

export type FaultNodeState =
  | "supported"
  | "weakly_supported"
  | "contradicted"
  | "unknown";

export type RawDefect = {
  defect_id: string;
  product_id: string;
  defect_ts: string;
  source_type: string | null;
  defect_code: string | null;
  severity: Severity;
  detected_section_id: string | null;
  occurrence_section_id: string | null;
  detected_test_result_id: string | null;
  reported_part_number: string | null;
  image_url: string | null;
  cost: number | null;
  notes: string | null;
  product_build_ts: string | null;
  article_id: string;
  article_name: string;
  order_id: string | null;
  detected_section_name: string | null;
  occurrence_section_name: string | null;
  reported_part_title: string | null;
  reported_part_commodity: string | null;
  detected_test_value: string | null;
  detected_test_overall: string | null;
  detected_test_unit: string | null;
  detected_test_name: string | null;
  detected_test_type: string | null;
  detected_test_lower: number | null;
  detected_test_upper: number | null;
};

export type RawClaim = {
  field_claim_id: string;
  product_id: string;
  claim_ts: string;
  market: string | null;
  complaint_text: string | null;
  reported_part_number: string | null;
  image_url: string | null;
  cost: number | null;
  detected_section_id: string | null;
  mapped_defect_id: string | null;
  notes: string | null;
  product_build_ts: string | null;
  article_id: string;
  article_name: string;
  mapped_defect_code: string | null;
  mapped_defect_severity: Severity | null;
  reported_part_title: string | null;
  reported_part_commodity: string | null;
  detected_section_name: string | null;
  days_from_build: number | null;
};

export type RawTraceability = {
  product_id: string;
  install_id: string;
  installed_ts: string | null;
  installed_section_id: string | null;
  position_code: string | null;
  install_user_id: string | null;
  bom_node_id: string;
  find_number: string | null;
  node_type: string | null;
  parent_find_number: string | null;
  parent_node_type: string | null;
  part_number: string;
  part_title: string;
  commodity: string | null;
  drawing_number: string | null;
  part_id: string;
  serial_number: string | null;
  quality_status: string | null;
  manufacturer_name: string | null;
  batch_id: string | null;
  batch_number: string | null;
  supplier_name: string | null;
  supplier_id: string | null;
  batch_received_date: string | null;
};

export type RawRework = {
  rework_id: string;
  defect_id: string;
  product_id: string;
  ts: string;
  rework_section_id: string | null;
  action_text: string | null;
  reported_part_number: string | null;
  user_id: string | null;
  image_url: string | null;
  time_minutes: number | null;
  cost: number | null;
};

export type RawQualitySummary = {
  article_id: string;
  article_name: string;
  week_start: string;
  products_built: number;
  defect_count: number;
  claim_count: number;
  rework_count: number;
  avg_rework_minutes: number | null;
  defect_cost_sum: number | null;
  claim_cost_sum: number | null;
  top_defect_code: string | null;
  top_defect_code_count: number | null;
};

export type RawAction = {
  action_id: string;
  product_id: string;
  ts: string;
  action_type: string;
  status: string;
  user_id: string;
  section_id: string | null;
  comments: string | null;
  defect_id: string | null;
};

export type KpiCard = {
  label: string;
  value: string;
  tone?: "default" | "alert" | "success";
  hint?: string;
};

export type IssueCard = {
  id: StoryType;
  storyType: StoryType;
  title: string;
  severity: Severity;
  summary: string;
  primaryStakeholders: Stakeholder[];
  affectedProducts: number;
  affectedClaims: number;
  timeWindow: string;
  confidence: string;
  anchorProductId: string | null;
  anchorDefectId: string | null;
  currentHypothesis: string;
  impactSummary: string;
  kpis: KpiCard[];
};

export type FaultNode = {
  id: string;
  label: string;
  state: FaultNodeState;
  evidenceCount: number;
  summary: string;
};

export type TimelineEvent = {
  id: string;
  date: string;
  type: "build" | "defect" | "claim" | "rework" | "action";
  title: string;
  detail: string;
  productId?: string | null;
};

export type ParetoItem = {
  code: string;
  count: number;
  cumulative: number;
};

export type TraceabilityNode = {
  assembly: string;
  assemblyType: string;
  items: Array<{
    productId: string;
    findNumber: string;
    partNumber: string;
    partTitle: string;
    batchId: string | null;
    supplierName: string | null;
    highlighted: boolean;
  }>;
};

export type BiasCheck = {
  title: string;
  status: "watch" | "good";
  detail: string;
};

export type StakeholderView = {
  stakeholder: Stakeholder;
  goals: string[];
  currentPain: string[];
  recommendedNextSteps: string[];
  relevantEvidenceRefs: string[];
};

export type ManagerBrief = {
  impactHeadline: string;
  riskLevel: string;
  decisionNeeded: string;
  containmentStatus: string;
  unresolvedQuestions: string[];
};

export type CopilotResponse = {
  problemStatement: string;
  hypotheses: Array<{ title: string; confidence: string; rationale: string }>;
  supportingEvidence: string[];
  missingEvidence: string[];
  containmentActions: string[];
  correctiveActions: string[];
  stakeholderImpact: string[];
  managerSummary: string;
  confidenceNote: string;
};

export type IssueDetail = {
  card: IssueCard;
  overviewMetrics: KpiCard[];
  timelineEvents: TimelineEvent[];
  evidence: {
    defects: RawDefect[];
    claims: RawClaim[];
    traceability: RawTraceability[];
    rework: RawRework[];
    qualitySummary: RawQualitySummary[];
    actions: RawAction[];
    pareto: ParetoItem[];
    faultTree: FaultNode[];
    traceabilityTree: TraceabilityNode[];
    biasChecks: BiasCheck[];
  };
  stakeholderViews: StakeholderView[];
  managerBrief: ManagerBrief;
};

export type CreateActionInput = {
  actionType: string;
  status: "open" | "in_progress" | "blocked" | "done";
  ownerUserId: string;
  comments: string;
  productId: string;
  defectId?: string;
  sectionId?: string;
};
