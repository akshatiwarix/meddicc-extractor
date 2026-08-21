import { z } from "zod";
import { TranscriptLineSchema } from "./transcript";
import { MEDDICC_PILLARS, PILLAR_STATUSES } from "./pillars";

export const GroundTruthPillarSchema = z.object({
  status: z.enum(PILLAR_STATUSES),
  value: z.string().nullable(),
});
export type GroundTruthPillar = z.infer<typeof GroundTruthPillarSchema>;

export const GroundTruthRecordSchema = z.object(
  Object.fromEntries(MEDDICC_PILLARS.map((pillar) => [pillar, GroundTruthPillarSchema])) as Record<
    (typeof MEDDICC_PILLARS)[number],
    typeof GroundTruthPillarSchema
  >,
);
export type GroundTruthRecord = z.infer<typeof GroundTruthRecordSchema>;

export const CallSchema = z.object({
  id: z.string(),
  date: z.string(),
  transcript: z.array(TranscriptLineSchema).min(1),
  groundTruth: GroundTruthRecordSchema,
});
export type Call = z.infer<typeof CallSchema>;
