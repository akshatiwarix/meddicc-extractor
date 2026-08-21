import type { GroundTruthPillar } from "@/lib/domain/call";
import type { PillarSignal } from "@/lib/domain/extraction";
import type { FieldMatch } from "@/lib/domain/grading";

/**
 * Grades one pillar's extracted signal against its ground truth.
 *
 * `absent` on both sides is a correct abstention — the honest answer to a
 * pillar that genuinely never came up is to say nothing, not to guess. A
 * `found`/`found` pair is correct only if the values match exactly; an
 * `ambiguous`/`ambiguous` pair is correct regardless of value, because the
 * honest answer to a genuine conflict is "unclear," not a pick between the
 * two claims.
 */
export function gradePillarField(extracted: PillarSignal, groundTruth: GroundTruthPillar): FieldMatch {
  if (groundTruth.status === "absent" && extracted.status === "absent") return "correct";
  if (groundTruth.status !== "absent" && extracted.status === "absent") return "missed";
  if (groundTruth.status === "absent" && extracted.status !== "absent") return "false-positive";
  if (groundTruth.status === "ambiguous" && extracted.status === "ambiguous") return "correct";
  if (groundTruth.status === "found" && extracted.status === "found") {
    return extracted.value === groundTruth.value ? "correct" : "incorrect";
  }
  return "incorrect";
}
