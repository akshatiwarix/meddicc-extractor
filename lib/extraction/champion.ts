import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { CHAMPION_VOCAB } from "@/lib/domain/vocab/champion";
import { extractPillarSignal } from "./generic";

export function extractChampion(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, CHAMPION_VOCAB);
}
