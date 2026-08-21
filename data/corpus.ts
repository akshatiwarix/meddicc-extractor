import { z } from "zod";
import { CallSchema } from "@/lib/domain/call";
import corpusJson from "./corpus.json";

const CorpusSchema = z.object({
  calls: z.array(CallSchema),
});

const corpus = CorpusSchema.parse(corpusJson);

export const CALLS = corpus.calls;
