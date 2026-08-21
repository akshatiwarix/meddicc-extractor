import type { MeddiccPillar } from "../pillars";
import type { PillarVocab } from "./types";
import { METRICS_VOCAB } from "./metrics";
import { ECONOMIC_BUYER_VOCAB } from "./economic-buyer";
import { DECISION_CRITERIA_VOCAB } from "./decision-criteria";
import { DECISION_PROCESS_VOCAB } from "./decision-process";
import { IDENTIFY_PAIN_VOCAB } from "./identify-pain";
import { CHAMPION_VOCAB } from "./champion";
import { COMPETITION_VOCAB } from "./competition";

export const PILLAR_VOCAB: Record<MeddiccPillar, PillarVocab> = {
  metrics: METRICS_VOCAB,
  economicBuyer: ECONOMIC_BUYER_VOCAB,
  decisionCriteria: DECISION_CRITERIA_VOCAB,
  decisionProcess: DECISION_PROCESS_VOCAB,
  identifyPain: IDENTIFY_PAIN_VOCAB,
  champion: CHAMPION_VOCAB,
  competition: COMPETITION_VOCAB,
};

export type { PillarVocab, VocabLine } from "./types";
