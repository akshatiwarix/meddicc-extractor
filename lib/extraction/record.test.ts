import { describe, expect, it } from "vitest";
import type { TranscriptLine } from "@/lib/domain/transcript";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { PILLAR_VOCAB } from "@/lib/domain/vocab";
import { extractRecord } from "./record";

function line(text: string): TranscriptLine {
  return { speaker: "prospect", speakerName: "Test", text };
}

describe("extractRecord", () => {
  it("returns absent for every pillar over a transcript with no signal at all", () => {
    const record = extractRecord([line("Thanks for hopping on the call today.")]);
    for (const pillar of MEDDICC_PILLARS) {
      expect(record[pillar].status).toBe("absent");
    }
  });

  it("extracts every pillar independently from a transcript that mentions all 7", () => {
    const lines = MEDDICC_PILLARS.map((pillar) => {
      const vocabLine = PILLAR_VOCAB[pillar].strong[0]!;
      return line(vocabLine.template.replace("{V}", vocabLine.value));
    });
    const record = extractRecord(lines);
    for (const pillar of MEDDICC_PILLARS) {
      const vocabLine = PILLAR_VOCAB[pillar].strong[0]!;
      expect(record[pillar].status).toBe("found");
      expect(record[pillar].value).toBe(vocabLine.value);
      expect(record[pillar].confidence).toBe("high");
    }
  });

  it("is deterministic: same transcript in, byte-identical record out", () => {
    const lines = [PILLAR_VOCAB.metrics.strong[0]!].map((v) => line(v.template.replace("{V}", v.value)));
    expect(JSON.stringify(extractRecord(lines))).toBe(JSON.stringify(extractRecord(lines)));
  });
});
