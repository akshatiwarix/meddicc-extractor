import { describe, expect, it } from "vitest";
import { TranscriptLineSchema } from "./transcript";
import { MEDDICC_PILLARS } from "./pillars";
import { CallSchema, GroundTruthRecordSchema } from "./call";
import { ExtractedRecordSchema, PillarSignalSchema } from "./extraction";
import { CallGradeSchema, CorpusAccuracySchema } from "./grading";
import { CallResultSchema, MeddiccResultSchema } from "./result";
import { makeCall, makeExtractedRecord, makeGroundTruthRecord, makeTranscriptLine } from "./fixtures";

describe("domain schemas", () => {
  it("accepts a well-formed TranscriptLine", () => {
    expect(() => TranscriptLineSchema.parse(makeTranscriptLine())).not.toThrow();
  });

  it("rejects a TranscriptLine with an invalid speaker", () => {
    expect(() => TranscriptLineSchema.parse({ ...makeTranscriptLine(), speaker: "narrator" })).toThrow();
  });

  it("accepts a well-formed PillarSignal in each status", () => {
    expect(() =>
      PillarSignalSchema.parse({ status: "found", value: "$120K", confidence: "high", evidence: [] }),
    ).not.toThrow();
    expect(() => PillarSignalSchema.parse({ status: "ambiguous", value: null, confidence: null, evidence: [] })).not.toThrow();
    expect(() => PillarSignalSchema.parse({ status: "absent", value: null, confidence: null, evidence: [] })).not.toThrow();
  });

  it("rejects a PillarSignal with an invalid confidence", () => {
    expect(() =>
      PillarSignalSchema.parse({ status: "found", value: "$120K", confidence: "extreme", evidence: [] }),
    ).toThrow();
  });

  it("accepts a well-formed GroundTruthRecord covering all 7 pillars", () => {
    const record = makeGroundTruthRecord();
    expect(Object.keys(record)).toHaveLength(MEDDICC_PILLARS.length);
    expect(() => GroundTruthRecordSchema.parse(record)).not.toThrow();
  });

  it("accepts a well-formed Call", () => {
    expect(() => CallSchema.parse(makeCall())).not.toThrow();
  });

  it("rejects a Call with an empty transcript", () => {
    expect(() => CallSchema.parse(makeCall({ transcript: [] }))).toThrow();
  });

  it("accepts a well-formed ExtractedRecord covering all 7 pillars", () => {
    const record = makeExtractedRecord();
    expect(Object.keys(record)).toHaveLength(MEDDICC_PILLARS.length);
    expect(() => ExtractedRecordSchema.parse(record)).not.toThrow();
  });

  it("accepts a well-formed CallGrade and CorpusAccuracy", () => {
    const pillarGrades = MEDDICC_PILLARS.map((pillar) => ({ pillar, match: "correct" as const }));
    expect(() => CallGradeSchema.parse({ pillarGrades, fieldAccuracy: 100 })).not.toThrow();
    expect(() =>
      CorpusAccuracySchema.parse({ callCount: 1, overallFieldAccuracy: 100, byAmbiguityProfile: { clean: 100, ambiguous: 100 } }),
    ).not.toThrow();
  });

  it("rejects a CallGrade with fieldAccuracy over 100", () => {
    const pillarGrades = MEDDICC_PILLARS.map((pillar) => ({ pillar, match: "correct" as const }));
    expect(() => CallGradeSchema.parse({ pillarGrades, fieldAccuracy: 101 })).toThrow();
  });

  it("accepts a well-formed CallResult and MeddiccResult", () => {
    const call = makeCall();
    const extracted = makeExtractedRecord();
    const pillarGrades = MEDDICC_PILLARS.map((pillar) => ({ pillar, match: "correct" as const }));
    const grade = { pillarGrades, fieldAccuracy: 100 };
    const callResult = { call, extracted, grade, completeness: 0 };
    expect(() => CallResultSchema.parse(callResult)).not.toThrow();

    const corpusAccuracy = { callCount: 1, overallFieldAccuracy: 100, byAmbiguityProfile: { clean: 100, ambiguous: 100 } };
    expect(() =>
      MeddiccResultSchema.parse({
        generatedAt: new Date().toISOString(),
        callCount: 1,
        calls: [callResult],
        corpusAccuracy,
      }),
    ).not.toThrow();
  });
});
