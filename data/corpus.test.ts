import { describe, expect, it } from "vitest";
import { CALLS } from "./corpus";
import { generateCorpus, CALL_COUNT } from "./generate";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";

describe("committed corpus", () => {
  it("has CALL_COUNT unique calls, each with a non-empty transcript", () => {
    expect(CALLS).toHaveLength(CALL_COUNT);
    expect(new Set(CALLS.map((c) => c.id)).size).toBe(CALL_COUNT);
    expect(CALLS.every((c) => c.transcript.length > 0)).toBe(true);
  });

  it("covers all 7 pillars with a non-degenerate status mix", () => {
    for (const pillar of MEDDICC_PILLARS) {
      const statuses = CALLS.map((c) => c.groundTruth[pillar].status);
      expect(statuses).toContain("found");
      expect(statuses).toContain("ambiguous");
      expect(statuses).toContain("absent");
    }
  });

  it("is byte-identical to a fresh generateCorpus() run (deterministic, matches committed JSON)", () => {
    const fresh = generateCorpus();
    expect(JSON.stringify(fresh.calls)).toBe(JSON.stringify(CALLS));
  });
});
