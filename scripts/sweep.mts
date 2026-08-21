import { CALLS } from "../data/corpus";
import { generateCorpus, CALL_COUNT } from "../data/generate";
import { gradeRecord } from "../lib/grading/record";
import { buildMeddiccResult } from "../lib/meddicc/build-result";
import { MEDDICC_PILLARS } from "../lib/domain/pillars";
import { PILLAR_STATUSES } from "../lib/domain/pillars";
import { FIELD_CONFIDENCES } from "../lib/domain/extraction";

let failures = 0;

function check(name: string, condition: boolean, detail: string): void {
  if (condition) {
    console.log(`  ok  ${name}`);
  } else {
    failures++;
    console.log(`FAIL  ${name} — ${detail}`);
  }
}

console.log("Sweep: nine invariants over the committed corpus + full extraction/grading pipeline\n");

// 1. Corpus size.
check(
  "1. corpus size",
  CALLS.length === CALL_COUNT && new Set(CALLS.map((c) => c.id)).size === CALL_COUNT &&
    CALLS.every((c) => c.transcript.length > 0),
  `expected ${CALL_COUNT} unique calls with non-empty transcripts, got ${CALLS.length}`,
);

// 2. Non-degenerate status mix per pillar.
{
  let ok = true;
  const detail: string[] = [];
  for (const pillar of MEDDICC_PILLARS) {
    const statuses = new Set(CALLS.map((c) => c.groundTruth[pillar].status));
    for (const status of PILLAR_STATUSES) {
      if (!statuses.has(status)) {
        ok = false;
        detail.push(`${pillar}/${status}=0`);
      }
    }
  }
  check("2. non-degenerate status mix (every pillar hits found/ambiguous/absent)", ok, detail.join(", "));
}

const generatedAt = "2026-01-01T00:00:00.000Z"; // fixed, for determinism checks below
const result = buildMeddiccResult(CALLS, generatedAt);

// 3. Field bounds.
{
  const statuses = new Set(PILLAR_STATUSES);
  const confidences = new Set(FIELD_CONFIDENCES);
  const inBounds = (n: number, max: number) => Number.isInteger(n) && n >= 0 && n <= max;
  const signalsOk = result.calls.every((r) =>
    MEDDICC_PILLARS.every((pillar) => {
      const signal = r.extracted[pillar];
      if (!statuses.has(signal.status)) return false;
      if (signal.status === "found") return signal.confidence !== null && confidences.has(signal.confidence);
      return signal.confidence === null;
    }),
  );
  const completenessOk = result.calls.every((r) => inBounds(r.completeness, MEDDICC_PILLARS.length));
  const gradeAccuracyOk = result.calls.every((r) => inBounds(r.grade.fieldAccuracy, 100));
  const overallOk = inBounds(result.corpusAccuracy.overallFieldAccuracy, 100);
  check(
    "3. field bounds (status/confidence enums, completeness in [0,7], fieldAccuracy in [0,100])",
    signalsOk && completenessOk && gradeAccuracyOk && overallOk,
    `signalsOk=${signalsOk} completenessOk=${completenessOk} gradeAccuracyOk=${gradeAccuracyOk} overallOk=${overallOk}`,
  );
}

// 4. Evidence traceability.
{
  let ok = true;
  let bad = "";
  for (const r of result.calls) {
    for (const pillar of MEDDICC_PILLARS) {
      for (const evidence of r.extracted[pillar].evidence) {
        const line = r.call.transcript[evidence.lineIndex];
        if (!line || line.text !== evidence.quote) {
          ok = false;
          bad = `${r.call.id} ${pillar} lineIndex=${evidence.lineIndex} quote=${JSON.stringify(evidence.quote)}`;
        }
      }
    }
  }
  check("4. evidence traceability", ok, bad || "n/a");
}

// 5. Grading reproducibility.
{
  const ok = result.calls.every((r) => {
    const recomputed = gradeRecord(r.extracted, r.call.groundTruth);
    return JSON.stringify(recomputed) === JSON.stringify(r.grade);
  });
  check("5. grading reproducibility (recompute matches precomputed)", ok, "a recomputed grade diverged from the precomputed one");
}

// 6. Confidence calibration.
{
  const samples: { confidence: string; correct: boolean }[] = [];
  for (const r of result.calls) {
    for (const grade of r.grade.pillarGrades) {
      const signal = r.extracted[grade.pillar];
      if (signal.confidence) samples.push({ confidence: signal.confidence, correct: grade.match === "correct" });
    }
  }
  const rate = (level: string) => {
    const subset = samples.filter((s) => s.confidence === level);
    return subset.length === 0 ? 0 : subset.filter((s) => s.correct).length / subset.length;
  };
  const highRate = rate("high");
  const lowRate = rate("low");
  check(
    "6. confidence calibration (high-confidence correctness >= low-confidence)",
    highRate >= lowRate,
    `highRate=${highRate.toFixed(3)} lowRate=${lowRate.toFixed(3)}`,
  );
}

// 7. Difficulty realism.
{
  const { clean, ambiguous } = result.corpusAccuracy.byAmbiguityProfile;
  check(
    "7. difficulty realism (ambiguous-profile calls score lower than clean)",
    ambiguous < clean,
    `clean=${clean} ambiguous=${ambiguous}`,
  );
}

// 8. Competence floor.
check(
  "8. competence floor (overall field accuracy >= 75)",
  result.corpusAccuracy.overallFieldAccuracy >= 75,
  `overallFieldAccuracy=${result.corpusAccuracy.overallFieldAccuracy}`,
);

// 9. Determinism.
{
  const corpusA = JSON.stringify(generateCorpus());
  const corpusB = JSON.stringify(generateCorpus());
  const pipelineA = JSON.stringify(buildMeddiccResult(CALLS, generatedAt));
  const pipelineB = JSON.stringify(buildMeddiccResult(CALLS, generatedAt));
  check(
    "9. determinism (corpus generation + full pipeline, byte-identical across two runs)",
    corpusA === corpusB && pipelineA === pipelineB,
    "two runs over the same seed/inputs differed",
  );
}

console.log(`\n${failures === 0 ? "All nine invariants passed." : `${failures} invariant(s) FAILED.`}`);
if (failures > 0) process.exit(1);

console.log("\nHeadline:");
console.log(
  `  overall field accuracy: ${result.corpusAccuracy.overallFieldAccuracy}  (clean: ${result.corpusAccuracy.byAmbiguityProfile.clean}, ambiguous: ${result.corpusAccuracy.byAmbiguityProfile.ambiguous})`,
);
