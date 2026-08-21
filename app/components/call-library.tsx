import type { MeddiccResult } from "@/lib/domain/result";
import { CorpusAccuracyPanel } from "./corpus-accuracy-panel";
import { CallTable } from "./call-table";

export function CallLibrary({ result }: { result: MeddiccResult }) {
  return (
    <div className="space-y-8">
      <CorpusAccuracyPanel accuracy={result.corpusAccuracy} />
      <CallTable calls={result.calls} />
    </div>
  );
}
