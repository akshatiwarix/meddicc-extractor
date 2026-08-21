import { z } from "zod";
import { CallSchema } from "./call";
import { ExtractedRecordSchema } from "./extraction";
import { CallGradeSchema, CorpusAccuracySchema } from "./grading";
import { MEDDICC_PILLARS } from "./pillars";

export const CallResultSchema = z.object({
  call: CallSchema,
  extracted: ExtractedRecordSchema,
  grade: CallGradeSchema,
  completeness: z.number().int().min(0).max(MEDDICC_PILLARS.length),
});
export type CallResult = z.infer<typeof CallResultSchema>;

export const MeddiccResultSchema = z.object({
  generatedAt: z.string(),
  callCount: z.number().int().nonnegative(),
  calls: z.array(CallResultSchema),
  corpusAccuracy: CorpusAccuracySchema,
});
export type MeddiccResult = z.infer<typeof MeddiccResultSchema>;
