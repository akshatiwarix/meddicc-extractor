import type { GroundTruthRecord } from "@/lib/domain/call";
import type { ExtractedRecord } from "@/lib/domain/extraction";
import type { CallGrade } from "@/lib/domain/grading";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { gradePillarField } from "./pillar";

export function gradeRecord(extracted: ExtractedRecord, groundTruth: GroundTruthRecord): CallGrade {
  const pillarGrades = MEDDICC_PILLARS.map((pillar) => ({
    pillar,
    match: gradePillarField(extracted[pillar], groundTruth[pillar]),
  }));
  const correctCount = pillarGrades.filter((g) => g.match === "correct").length;
  return {
    pillarGrades,
    fieldAccuracy: Math.round((100 * correctCount) / MEDDICC_PILLARS.length),
  };
}
