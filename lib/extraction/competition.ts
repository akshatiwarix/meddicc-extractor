import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { COMPETITION_VOCAB } from "@/lib/domain/vocab/competition";
import { extractPillarSignal } from "./generic";

export function extractCompetition(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, COMPETITION_VOCAB);
}
