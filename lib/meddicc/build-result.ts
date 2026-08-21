import type { Call } from "@/lib/domain/call";
import type { CorpusAccuracy } from "@/lib/domain/grading";
import type { CallResult, MeddiccResult } from "@/lib/domain/result";
import { extractRecord } from "@/lib/extraction/record";
import { gradeRecord } from "@/lib/grading/record";
import { computeCompleteness } from "@/lib/grading/accuracy";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** A call is "ambiguous" for corpus-accuracy grouping if any pillar's ground truth is ambiguous. */
export function isAmbiguousCall(call: Call): boolean {
  return Object.values(call.groundTruth).some((pillar) => pillar.status === "ambiguous");
}

function computeCorpusAccuracy(results: CallResult[]): CorpusAccuracy {
  const clean = results.filter((r) => !isAmbiguousCall(r.call));
  const ambiguous = results.filter((r) => isAmbiguousCall(r.call));

  return {
    callCount: results.length,
    overallFieldAccuracy: average(results.map((r) => r.grade.fieldAccuracy)),
    byAmbiguityProfile: {
      clean: average(clean.map((r) => r.grade.fieldAccuracy)),
      ambiguous: average(ambiguous.map((r) => r.grade.fieldAccuracy)),
    },
  };
}

/**
 * Runs extraction + grading for every call and assembles the full result.
 * `generatedAt` is a parameter, never read from the clock internally, so the
 * pipeline stays byte-identical for the same corpus across runs.
 */
export function buildMeddiccResult(calls: Call[], generatedAt: string): MeddiccResult {
  const callResults: CallResult[] = calls.map((call) => {
    const extracted = extractRecord(call.transcript);
    const grade = gradeRecord(extracted, call.groundTruth);
    const completeness = computeCompleteness(extracted);
    return { call, extracted, grade, completeness };
  });

  return {
    generatedAt,
    callCount: calls.length,
    calls: callResults,
    corpusAccuracy: computeCorpusAccuracy(callResults),
  };
}
