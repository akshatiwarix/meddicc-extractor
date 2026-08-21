import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { DECISION_PROCESS_VOCAB } from "@/lib/domain/vocab/decision-process";
import { extractPillarSignal } from "./generic";

export function extractDecisionProcess(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, DECISION_PROCESS_VOCAB);
}
