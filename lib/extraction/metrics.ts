import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { METRICS_VOCAB } from "@/lib/domain/vocab/metrics";
import { extractPillarSignal } from "./generic";

export function extractMetrics(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, METRICS_VOCAB);
}
