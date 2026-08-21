import { describe, expect, it } from "vitest";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { makeExtractedRecord, makeGroundTruthRecord } from "@/lib/domain/fixtures";
import { gradeRecord } from "./record";

describe("gradeRecord", () => {
  it("scores 100 when every pillar matches ground truth (all absent)", () => {
    const grade = gradeRecord(makeExtractedRecord(), makeGroundTruthRecord());
    expect(grade.fieldAccuracy).toBe(100);
    expect(grade.pillarGrades).toHaveLength(MEDDICC_PILLARS.length);
    expect(grade.pillarGrades.every((g) => g.match === "correct")).toBe(true);
  });

  it("scores partial credit when only some pillars match", () => {
    // metrics: found vs found, different value -> incorrect. Remaining 6 pillars: absent vs absent -> correct.
    const extracted = makeExtractedRecord({
      metrics: { status: "found", value: "$120K", confidence: "high", evidence: [] },
    });
    const groundTruth = makeGroundTruthRecord({ metrics: { status: "found", value: "$250K" } });
    const grade = gradeRecord(extracted, groundTruth);
    expect(grade.fieldAccuracy).toBe(Math.round((100 * 6) / 7));
  });
});
