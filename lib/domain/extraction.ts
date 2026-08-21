import { z } from "zod";
import { MEDDICC_PILLARS, PILLAR_STATUSES } from "./pillars";

export const FIELD_CONFIDENCES = ["high", "medium", "low"] as const;
export type FieldConfidence = (typeof FIELD_CONFIDENCES)[number];

export const EvidenceSchema = z.object({
  lineIndex: z.number().int().nonnegative(),
  quote: z.string(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

/**
 * `value` and `confidence` are non-null only when `status === "found"`.
 * Ambiguous means two-or-more conflicting values were found (honest answer
 * is "unclear", not a guess at which wins); absent means the pillar never
 * came up. zod can't express the cross-field nullability constraint, so it
 * is enforced by construction in lib/extraction/ instead.
 */
export const PillarSignalSchema = z.object({
  status: z.enum(PILLAR_STATUSES),
  value: z.string().nullable(),
  confidence: z.enum(FIELD_CONFIDENCES).nullable(),
  evidence: z.array(EvidenceSchema),
});
export type PillarSignal = z.infer<typeof PillarSignalSchema>;

export const ExtractedRecordSchema = z.object(
  Object.fromEntries(MEDDICC_PILLARS.map((pillar) => [pillar, PillarSignalSchema])) as Record<
    (typeof MEDDICC_PILLARS)[number],
    typeof PillarSignalSchema
  >,
);
export type ExtractedRecord = z.infer<typeof ExtractedRecordSchema>;
