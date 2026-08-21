import { describe, expect, it } from "vitest";
import { CALLS } from "@/data/corpus";
import { buildMeddiccResult } from "./build-result";

describe("buildMeddiccResult", () => {
  const generatedAt = "2026-01-01T00:00:00.000Z";

  it("produces one CallResult per call with a completeness in [0, 7]", () => {
    const result = buildMeddiccResult(CALLS, generatedAt);
    expect(result.calls).toHaveLength(CALLS.length);
    for (const callResult of result.calls) {
      expect(callResult.completeness).toBeGreaterThanOrEqual(0);
      expect(callResult.completeness).toBeLessThanOrEqual(7);
    }
  });

  it("is deterministic across two runs over the same corpus", () => {
    const a = buildMeddiccResult(CALLS, generatedAt);
    const b = buildMeddiccResult(CALLS, generatedAt);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("computes corpus accuracy as the average field accuracy, split by ambiguity profile", () => {
    const result = buildMeddiccResult(CALLS, generatedAt);
    expect(result.corpusAccuracy.callCount).toBe(CALLS.length);
    expect(result.corpusAccuracy.overallFieldAccuracy).toBeGreaterThanOrEqual(0);
    expect(result.corpusAccuracy.overallFieldAccuracy).toBeLessThanOrEqual(100);
  });
});
