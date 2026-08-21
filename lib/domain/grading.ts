import { z } from "zod";
import { MEDDICC_PILLARS } from "./pillars";

export const FIELD_MATCHES = ["correct", "missed", "false-positive", "incorrect"] as const;
export type FieldMatch = (typeof FIELD_MATCHES)[number];

export const PillarGradeSchema = z.object({
  pillar: z.enum(MEDDICC_PILLARS),
  match: z.enum(FIELD_MATCHES),
});
export type PillarGrade = z.infer<typeof PillarGradeSchema>;

export const CallGradeSchema = z.object({
  pillarGrades: z.array(PillarGradeSchema).length(MEDDICC_PILLARS.length),
  fieldAccuracy: z.number().int().min(0).max(100),
});
export type CallGrade = z.infer<typeof CallGradeSchema>;

export const CorpusAccuracySchema = z.object({
  callCount: z.number().int().nonnegative(),
  overallFieldAccuracy: z.number().int().min(0).max(100),
  byAmbiguityProfile: z.object({
    clean: z.number().int().min(0).max(100),
    ambiguous: z.number().int().min(0).max(100),
  }),
});
export type CorpusAccuracy = z.infer<typeof CorpusAccuracySchema>;
