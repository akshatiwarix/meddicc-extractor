import type { TranscriptLine } from "@/lib/domain/transcript";
import type { Evidence, FieldConfidence, PillarSignal } from "@/lib/domain/extraction";
import type { PillarVocab, VocabLine } from "@/lib/domain/vocab/types";

/**
 * Every pillar extractor has the same shape (see PLAN.md § Method): a
 * template's `{V}` slot becomes a regex capture group, so scanning a line
 * against the same template the generator used to write it recovers the
 * exact value that was embedded. One distinct captured value across the
 * whole transcript is a confident read; two or more is a genuine conflict.
 */
function templateToRegex(template: string): RegExp {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace("\\{V\\}", "(.+?)");
  return new RegExp(pattern, "i");
}

const TIERS: { key: keyof PillarVocab; confidence: FieldConfidence }[] = [
  { key: "strong", confidence: "high" },
  { key: "medium", confidence: "medium" },
  { key: "weak", confidence: "low" },
];

type MatchInfo = { confidence: FieldConfidence; evidence: Evidence[] };

function matchLine(line: VocabLine, text: string): string | null {
  const match = templateToRegex(line.template).exec(text);
  return match ? (match[1] ?? "").trim() : null;
}

export function extractPillarSignal(transcript: TranscriptLine[], vocab: PillarVocab): PillarSignal {
  const matchesByValue = new Map<string, MatchInfo>();

  transcript.forEach((line, lineIndex) => {
    for (const tier of TIERS) {
      for (const vocabLine of vocab[tier.key]) {
        const captured = matchLine(vocabLine, line.text);
        if (captured === null) continue;
        const evidence: Evidence = { lineIndex, quote: line.text };
        const existing = matchesByValue.get(captured);
        if (existing) {
          existing.evidence.push(evidence);
        } else {
          matchesByValue.set(captured, { confidence: tier.confidence, evidence: [evidence] });
        }
      }
    }
  });

  if (matchesByValue.size === 0) {
    return { status: "absent", value: null, confidence: null, evidence: [] };
  }

  if (matchesByValue.size === 1) {
    const [value, info] = Array.from(matchesByValue.entries())[0]!;
    return { status: "found", value, confidence: info.confidence, evidence: info.evidence };
  }

  const evidence = Array.from(matchesByValue.values()).flatMap((info) => info.evidence);
  return { status: "ambiguous", value: null, confidence: null, evidence };
}
