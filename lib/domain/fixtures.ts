import type { Call, GroundTruthRecord } from "./call";
import type { TranscriptLine } from "./transcript";
import type { ExtractedRecord, PillarSignal } from "./extraction";
import { MEDDICC_PILLARS } from "./pillars";

export function makeTranscriptLine(overrides: Partial<TranscriptLine> = {}): TranscriptLine {
  return {
    speaker: "rep",
    speakerName: "Sam",
    text: "Thanks for hopping on the call today.",
    ...overrides,
  };
}

const absentGroundTruthPillar = { status: "absent" as const, value: null };

export function makeGroundTruthRecord(overrides: Partial<GroundTruthRecord> = {}): GroundTruthRecord {
  return {
    ...(Object.fromEntries(MEDDICC_PILLARS.map((pillar) => [pillar, absentGroundTruthPillar])) as GroundTruthRecord),
    ...overrides,
  };
}

export function makeCall(overrides: Partial<Call> = {}): Call {
  return {
    id: "call-1",
    date: "2026-01-15",
    transcript: [makeTranscriptLine()],
    groundTruth: makeGroundTruthRecord(),
    ...overrides,
  };
}

const absentPillarSignal: PillarSignal = { status: "absent", value: null, confidence: null, evidence: [] };

export function makeExtractedRecord(overrides: Partial<ExtractedRecord> = {}): ExtractedRecord {
  return {
    ...(Object.fromEntries(MEDDICC_PILLARS.map((pillar) => [pillar, absentPillarSignal])) as ExtractedRecord),
    ...overrides,
  };
}
