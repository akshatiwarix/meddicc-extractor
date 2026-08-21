import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { ECONOMIC_BUYER_VOCAB } from "@/lib/domain/vocab/economic-buyer";
import { extractPillarSignal } from "./generic";

export function extractEconomicBuyer(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, ECONOMIC_BUYER_VOCAB);
}
