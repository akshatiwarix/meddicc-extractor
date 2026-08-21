import { describe, expect, it } from "vitest";
import { makeExtractedRecord } from "@/lib/domain/fixtures";
import { computeCompleteness } from "./accuracy";

describe("computeCompleteness", () => {
  it("is 0 when every pillar is absent", () => {
    expect(computeCompleteness(makeExtractedRecord())).toBe(0);
  });

  it("counts only found pillars, not ambiguous or absent", () => {
    const record = makeExtractedRecord({
      metrics: { status: "found", value: "$120K", confidence: "high", evidence: [] },
      champion: { status: "found", value: "Grace Feldman, Sales Ops Manager", confidence: "high", evidence: [] },
      competition: { status: "ambiguous", value: null, confidence: null, evidence: [] },
    });
    expect(computeCompleteness(record)).toBe(2);
  });
});
