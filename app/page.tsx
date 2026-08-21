import { CALLS } from "@/data/corpus";
import { buildMeddiccResult } from "@/lib/meddicc/build-result";
import { CallLibrary } from "@/app/components/call-library";

export default function Home() {
  const result = buildMeddiccResult(CALLS, new Date().toISOString());

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-dim">
          Day 024 of 100 · MEDDICC Extractor
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-ink sm:text-5xl">
          Every call, qualified against all seven pillars.
        </h1>
        <p className="mt-4 text-ink-dim">
          {result.callCount} synthetic sales-call transcripts run through a deterministic
          MEDDICC extractor — Metrics, Economic Buyer, Decision Criteria, Decision Process,
          Identify Pain, Champion, Competition — each pillar carrying its status, evidence, and
          confidence, and graded against a hidden ground-truth answer key.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a
            className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            href="https://github.com/akshatiwarix/meddicc-extractor"
          >
            Source
          </a>
          <a
            className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            href="/try-it"
          >
            Try It Yourself
          </a>
          <a
            className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            href="/api/v1/records"
          >
            GET /api/v1/records
          </a>
          <a
            className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            href="/api/schema"
          >
            GET /api/schema
          </a>
          <a
            className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            href="https://github.com/akshatiwarix/meddicc-extractor/blob/main/PLAN.md"
          >
            Plan
          </a>
        </p>
      </header>

      <CallLibrary result={result} />

      <footer className="mt-16 border-t border-line pt-6 text-xs text-ink-dim">
        Synthetic, seeded corpus — no real calls, no live API calls, no model calls. Every
        extraction rule and the grading formula are documented deterministic logic (see
        PLAN.md).
      </footer>
    </main>
  );
}
