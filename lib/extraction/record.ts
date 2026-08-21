import type { TranscriptLine } from "@/lib/domain/transcript";
import type { ExtractedRecord } from "@/lib/domain/extraction";
import { extractMetrics } from "./metrics";
import { extractEconomicBuyer } from "./economic-buyer";
import { extractDecisionCriteria } from "./decision-criteria";
import { extractDecisionProcess } from "./decision-process";
import { extractIdentifyPain } from "./identify-pain";
import { extractChampion } from "./champion";
import { extractCompetition } from "./competition";

export function extractRecord(transcript: TranscriptLine[]): ExtractedRecord {
  return {
    metrics: extractMetrics(transcript),
    economicBuyer: extractEconomicBuyer(transcript),
    decisionCriteria: extractDecisionCriteria(transcript),
    decisionProcess: extractDecisionProcess(transcript),
    identifyPain: extractIdentifyPain(transcript),
    champion: extractChampion(transcript),
    competition: extractCompetition(transcript),
  };
}
