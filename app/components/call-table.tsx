"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CallResult } from "@/lib/domain/result";
import { MEDDICC_PILLARS } from "@/lib/domain/pillars";
import { isAmbiguousCall } from "@/lib/meddicc/build-result";

type SortColumn = "completeness" | "accuracy" | "date";
const ALL = "All" as const;
type ProfileFilter = "clean" | "ambiguous" | typeof ALL;

const SORT_LABEL: Record<SortColumn, string> = {
  completeness: "completeness",
  accuracy: "accuracy",
  date: "date",
};

export function CallTable({ calls }: { calls: CallResult[] }) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("completeness");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>(ALL);

  const filtered = useMemo(
    () =>
      calls.filter((r) => {
        if (profileFilter === ALL) return true;
        const ambiguous = isAmbiguousCall(r.call);
        return profileFilter === "ambiguous" ? ambiguous : !ambiguous;
      }),
    [calls, profileFilter],
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortColumn === "completeness") {
        const diff = b.completeness - a.completeness;
        if (diff !== 0) return diff;
      } else if (sortColumn === "accuracy") {
        const diff = b.grade.fieldAccuracy - a.grade.fieldAccuracy;
        if (diff !== 0) return diff;
      } else {
        const diff = b.call.date.localeCompare(a.call.date);
        if (diff !== 0) return diff;
      }
      return a.call.id.localeCompare(b.call.id);
    });
  }, [filtered, sortColumn]);

  return (
    <section aria-labelledby="table-heading" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="table-heading" className="font-display text-2xl italic text-ink">
          Call Library
        </h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <select
            aria-label="Filter by ambiguity profile"
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value as ProfileFilter)}
            className="rounded-md border border-line bg-paper-raised px-2 py-1"
          >
            <option value={ALL}>All calls</option>
            <option value="clean">Clean</option>
            <option value="ambiguous">Ambiguous</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-dim">
        Showing {sorted.length} of {calls.length} calls, sorted by{" "}
        <span className="font-medium text-ink">{SORT_LABEL[sortColumn]}</span>. Sort by{" "}
        {(["completeness", "accuracy", "date"] as const).map((column, i) => (
          <span key={column}>
            {i > 0 && " · "}
            <button
              type="button"
              onClick={() => setSortColumn(column)}
              className={
                sortColumn === column
                  ? "font-medium text-ink underline decoration-line-strong underline-offset-2"
                  : "underline decoration-line-strong underline-offset-2 hover:decoration-ink"
              }
            >
              {SORT_LABEL[column]}
            </button>
          </span>
        ))}
        .
      </p>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-raised text-left text-xs uppercase tracking-wide text-ink-dim">
              <th className="px-3 py-2">Call</th>
              <th className="px-3 py-2">Completeness</th>
              <th className="px-3 py-2">Field accuracy</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((result) => (
              <tr key={result.call.id} className="border-b border-line last:border-0 hover:bg-paper-raised">
                <td className="px-3 py-2">
                  <Link
                    href={`/calls/${result.call.id}`}
                    className="font-medium text-ink underline decoration-line-strong underline-offset-2 hover:decoration-ink"
                  >
                    {result.call.date}
                  </Link>
                  <div className="mt-0.5 text-xs text-ink-dim">
                    {isAmbiguousCall(result.call) ? "ambiguous" : "clean"}
                  </div>
                </td>
                <td className="px-3 py-2 text-ink">
                  <span className="tabular font-mono text-base font-semibold text-ink">
                    {result.completeness}
                  </span>
                  <span className="text-ink-dim"> / {MEDDICC_PILLARS.length}</span>
                </td>
                <td className="px-3 py-2">
                  <span className="tabular font-mono text-base font-semibold text-ink">
                    {result.grade.fieldAccuracy}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
