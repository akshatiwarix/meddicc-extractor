"use client";

import { useMemo, useState } from "react";
import { parseTranscriptText } from "@/lib/extraction/parse-transcript";
import { extractRecord } from "@/lib/extraction/record";
import { TranscriptView } from "./transcript-view";
import { ExtractedRecordPanel } from "./extracted-record-panel";

const EXAMPLE = `Sam (rep): Thanks for hopping on the call today, glad we could find the time.
Elena Diaz (prospect): This is Elena Diaz, I'm the Director of Operations here at Northwind Labs.
Sam (rep): Tell me a bit about what's driving this project.
Elena Diaz (prospect): The real problem for us is manual reporting eating up 10 hours a week.
Elena Diaz (prospect): That would save us $120K a year in operating costs.
Elena Diaz (prospect): SOC 2 compliance is a hard requirement for us — we can't move forward without it.
Elena Diaz (prospect): Grace Feldman, Sales Ops Manager has been championing this internally.
Elena Diaz (prospect): Sounds good, appreciate the time today.`;

export function TryItForm() {
  const [rawText, setRawText] = useState(EXAMPLE);

  const { transcript, skippedLineCount } = useMemo(() => parseTranscriptText(rawText), [rawText]);
  const extracted = useMemo(() => extractRecord(transcript), [transcript]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-xl italic text-ink">Paste or edit a transcript</h2>
        <p className="mt-1 text-xs text-ink-dim">
          One line per turn: <code className="font-mono">Speaker Name (rep|prospect): what they said.</code>
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={16}
          spellCheck={false}
          aria-label="Transcript text"
          className="mt-3 w-full rounded-lg border border-line bg-paper-raised p-3 font-mono text-sm text-ink"
        />
        {skippedLineCount > 0 && (
          <p className="mt-2 text-xs text-confidence-low">
            {skippedLineCount} line{skippedLineCount === 1 ? "" : "s"} didn&apos;t match the format above
            and {skippedLineCount === 1 ? "was" : "were"} skipped.
          </p>
        )}
        <div className="mt-4 max-h-[300px] overflow-y-auto rounded-lg border border-line bg-paper-raised p-4">
          <TranscriptView transcript={transcript} />
        </div>
      </div>
      <div>
        <h2 className="font-display text-xl italic text-ink">MEDDICC breakdown</h2>
        <p className="mt-1 text-xs text-ink-dim">
          Runs the exact same extractor as the Call Library, live in your browser. No accuracy
          grade here — there&apos;s no ground truth for text you wrote yourself.
        </p>
        <div className="mt-3 rounded-lg border border-line bg-paper-raised p-4">
          <ExtractedRecordPanel extracted={extracted} />
        </div>
      </div>
    </div>
  );
}
