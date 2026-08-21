import { describe, expect, it } from "vitest";
import type { PillarSignal } from "@/lib/domain/extraction";
import type { GroundTruthPillar } from "@/lib/domain/call";
import { gradePillarField } from "./pillar";

const found = (value: string): PillarSignal => ({ status: "found", value, confidence: "high", evidence: [] });
const ambiguous: PillarSignal = { status: "ambiguous", value: null, confidence: null, evidence: [] };
const absent: PillarSignal = { status: "absent", value: null, confidence: null, evidence: [] };

const gtFound = (value: string): GroundTruthPillar => ({ status: "found", value });
const gtAmbiguous: GroundTruthPillar = { status: "ambiguous", value: null };
const gtAbsent: GroundTruthPillar = { status: "absent", value: null };

describe("gradePillarField", () => {
  it("both absent is correct", () => {
    expect(gradePillarField(absent, gtAbsent)).toBe("correct");
  });

  it("ground truth found, extracted absent is missed", () => {
    expect(gradePillarField(absent, gtFound("$120K"))).toBe("missed");
  });

  it("ground truth ambiguous, extracted absent is missed", () => {
    expect(gradePillarField(absent, gtAmbiguous)).toBe("missed");
  });

  it("ground truth absent, extracted found is false-positive", () => {
    expect(gradePillarField(found("$120K"), gtAbsent)).toBe("false-positive");
  });

  it("both ambiguous is correct regardless of value", () => {
    expect(gradePillarField(ambiguous, gtAmbiguous)).toBe("correct");
  });

  it("both found with matching values is correct", () => {
    expect(gradePillarField(found("$120K"), gtFound("$120K"))).toBe("correct");
  });

  it("both found with different values is incorrect", () => {
    expect(gradePillarField(found("$120K"), gtFound("$250K"))).toBe("incorrect");
  });

  it("found vs ambiguous mismatch is incorrect", () => {
    expect(gradePillarField(found("$120K"), gtAmbiguous)).toBe("incorrect");
    expect(gradePillarField(ambiguous, gtFound("$120K"))).toBe("incorrect");
  });
});
