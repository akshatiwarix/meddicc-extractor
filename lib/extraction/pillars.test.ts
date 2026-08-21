import { describe, expect, it } from "vitest";
import type { TranscriptLine } from "@/lib/domain/transcript";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { PILLAR_VOCAB } from "@/lib/domain/vocab";
import { extractMetrics } from "./metrics";
import { extractEconomicBuyer } from "./economic-buyer";
import { extractDecisionCriteria } from "./decision-criteria";
import { extractDecisionProcess } from "./decision-process";
import { extractIdentifyPain } from "./identify-pain";
import { extractChampion } from "./champion";
import { extractCompetition } from "./competition";

const EXTRACTORS = {
  metrics: extractMetrics,
  economicBuyer: extractEconomicBuyer,
  decisionCriteria: extractDecisionCriteria,
  decisionProcess: extractDecisionProcess,
  identifyPain: extractIdentifyPain,
  champion: extractChampion,
  competition: extractCompetition,
} as const;

function line(text: string): TranscriptLine {
  return { speaker: "prospect", speakerName: "Test", text };
}

describe.each(MEDDICC_PILLARS)("pillar: %s", (pillar) => {
  const extract = EXTRACTORS[pillar];
  const vocab = PILLAR_VOCAB[pillar];

  it("returns absent with no signal when the pillar never comes up", () => {
    const result = extract([line("Thanks for hopping on the call today.")]);
    expect(result).toEqual({ status: "absent", value: null, confidence: null, evidence: [] });
  });

  it.each(["strong", "medium", "weak"] as const)("returns found + %s tier confidence on a single match", (tier) => {
    const confidence = { strong: "high", medium: "medium", weak: "low" }[tier];
    const vocabLine = vocab[tier][0]!;
    const text = vocabLine.template.replace("{V}", vocabLine.value);
    const result = extract([line(text)]);
    expect(result.status).toBe("found");
    expect(result.value).toBe(vocabLine.value);
    expect(result.confidence).toBe(confidence);
    expect(result.evidence).toEqual([{ lineIndex: 0, quote: text }]);
  });

  it("returns ambiguous with no value/confidence when two distinct values are asserted", () => {
    const [a, b] = vocab.strong;
    if (!a || !b) throw new Error(`${pillar} needs at least 2 strong vocab lines for this test`);
    const textA = a.template.replace("{V}", a.value);
    const textB = b.template.replace("{V}", b.value);
    const result = extract([line(textA), line(textB)]);
    expect(result.status).toBe("ambiguous");
    expect(result.value).toBeNull();
    expect(result.confidence).toBeNull();
    expect(result.evidence).toHaveLength(2);
  });

  it("collapses repeated mentions of the same value into one found signal", () => {
    const vocabLine = vocab.strong[0]!;
    const text = vocabLine.template.replace("{V}", vocabLine.value);
    const result = extract([line(text), line(text)]);
    expect(result.status).toBe("found");
    expect(result.evidence).toHaveLength(2);
  });
});
