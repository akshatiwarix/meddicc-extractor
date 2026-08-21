import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { DECISION_CRITERIA_VOCAB } from "@/lib/domain/vocab/decision-criteria";
import { extractPillarSignal } from "./generic";

export function extractDecisionCriteria(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, DECISION_CRITERIA_VOCAB);
}
