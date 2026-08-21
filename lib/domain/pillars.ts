export const MEDDICC_PILLARS = [
  "metrics",
  "economicBuyer",
  "decisionCriteria",
  "decisionProcess",
  "identifyPain",
  "champion",
  "competition",
] as const;
export type MeddiccPillar = (typeof MEDDICC_PILLARS)[number];

export const PILLAR_LABELS: Record<MeddiccPillar, string> = {
  metrics: "Metrics",
  economicBuyer: "Economic Buyer",
  decisionCriteria: "Decision Criteria",
  decisionProcess: "Decision Process",
  identifyPain: "Identify Pain",
  champion: "Champion",
  competition: "Competition",
};

export const PILLAR_STATUSES = ["found", "ambiguous", "absent"] as const;
export type PillarStatus = (typeof PILLAR_STATUSES)[number];
