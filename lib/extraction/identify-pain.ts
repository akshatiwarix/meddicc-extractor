import type { TranscriptLine } from "@/lib/domain/transcript";
import type { PillarSignal } from "@/lib/domain/extraction";
import { IDENTIFY_PAIN_VOCAB } from "@/lib/domain/vocab/identify-pain";
import { extractPillarSignal } from "./generic";

export function extractIdentifyPain(transcript: TranscriptLine[]): PillarSignal {
  return extractPillarSignal(transcript, IDENTIFY_PAIN_VOCAB);
}
