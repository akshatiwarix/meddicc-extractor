import type { ExtractedRecord } from "@/lib/domain/extraction";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";

/** The extracted record's own completeness — how many pillars it calls "found". Independent of grading. */
export function computeCompleteness(extracted: ExtractedRecord): number {
  return MEDDICC_PILLARS.filter((pillar) => extracted[pillar].status === "found").length;
}
