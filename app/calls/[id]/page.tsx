import { notFound } from "next/navigation";
import Link from "next/link";
import { CALLS } from "@/data/corpus";
import { extractRecord } from "@/lib/extraction/record";
import { gradeRecord } from "@/lib/grading/record";
import { computeCompleteness } from "@/lib/grading/accuracy";
import { isAmbiguousCall } from "@/lib/meddicc/build-result";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { TranscriptView } from "@/app/components/transcript-view";
import { ExtractedRecordPanel } from "@/app/components/extracted-record-panel";

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const call = CALLS.find((c) => c.id === id);

  if (!call) notFound();

  const extracted = extractRecord(call.transcript);
  const grade = gradeRecord(extracted, call.groundTruth);
  const completeness = computeCompleteness(extracted);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm underline decoration-line-strong underline-offset-4 hover:decoration-ink">
        ← Back to Call Library
      </Link>

      <header className="mt-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-dim">
          {call.date} · {isAmbiguousCall(call) ? "ambiguous" : "clean"}
        </span>
        <h1 className="mt-1 font-display text-3xl italic text-ink sm:text-4xl">{call.id}</h1>
        <p className="mt-1 text-ink-dim">
          Completeness: <span className="tabular font-mono font-semibold text-ink">{completeness}</span>
          {` / ${MEDDICC_PILLARS.length} pillars found`} · Field accuracy:{" "}
          <span className="tabular font-mono font-semibold text-ink">{grade.fieldAccuracy}</span>
          {" / 100, graded against this call's hidden ground-truth answer key."}
        </p>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl italic text-ink">Transcript</h2>
          <div className="mt-3 max-h-[600px] overflow-y-auto rounded-lg border border-line bg-paper-raised p-4">
            <TranscriptView transcript={call.transcript} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl italic text-ink">MEDDICC breakdown</h2>
          <div className="mt-3 rounded-lg border border-line bg-paper-raised p-4">
            <ExtractedRecordPanel extracted={extracted} grade={grade} />
          </div>
        </div>
      </section>
    </main>
  );
}
