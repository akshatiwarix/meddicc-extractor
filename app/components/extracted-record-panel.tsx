import type { ExtractedRecord } from "@/lib/domain/extraction";
import type { CallGrade } from "@/lib/domain/grading";
import { MEDDICC_PILLARS, PILLAR_LABELS } from "@/lib/domain/pillars";
import { ConfidenceBadge } from "./confidence-badge";
import { StatusBadge } from "./status-badge";
import { GradeBadge } from "./grade-badge";

const STATUS_VALUE_LABEL = {
  found: (value: string) => value,
  ambiguous: () => "Conflicting signals",
  absent: () => "Not mentioned",
} as const;

function EvidenceList({ evidence }: { evidence: { lineIndex: number; quote: string }[] }) {
  if (evidence.length === 0) {
    return <p className="mt-1 text-xs italic text-ink-dim">No supporting line found.</p>;
  }
  return (
    <ul className="mt-1 space-y-0.5">
      {evidence.map((e) => (
        <li key={e.lineIndex} className="text-xs text-ink-dim">
          &ldquo;{e.quote}&rdquo; <span className="text-ink-dim/70">(line {e.lineIndex + 1})</span>
        </li>
      ))}
    </ul>
  );
}

export function ExtractedRecordPanel({
  extracted,
  grade,
}: {
  extracted: ExtractedRecord;
  /** Omit for ungraded input (Try It Yourself) — there is no ground truth to grade arbitrary text against. */
  grade?: CallGrade;
}) {
  return (
    <div>
      {MEDDICC_PILLARS.map((pillar) => {
        const signal = extracted[pillar];
        const pillarGrade = grade?.pillarGrades.find((g) => g.pillar === pillar);
        return (
          <div key={pillar} className="border-b border-line py-3 last:border-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-dim">{PILLAR_LABELS[pillar]}</span>
              <span className="flex items-center gap-1.5">
                <StatusBadge status={signal.status} />
                {signal.confidence && <ConfidenceBadge confidence={signal.confidence} />}
                {pillarGrade && <GradeBadge match={pillarGrade.match} />}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-ink">
              {STATUS_VALUE_LABEL[signal.status](signal.value ?? "")}
            </p>
            <EvidenceList evidence={signal.evidence} />
          </div>
        );
      })}
    </div>
  );
}
