# MEDDICC Extractor — Plan

Day 024 of a 100-day portfolio series. **This file is the contract for this
repo** — settled with the user before any code was written. If code and this
file disagree, the code is wrong; if the plan needs to change, it changes
here first, in writing, with a reason.

## Problem

MEDDICC (Metrics, Economic Buyer, Decision Criteria, Decision Process,
Identify Pain, Champion, Competition) is the qualification checklist sales
teams use to judge how real a deal is. In practice reps fill it in from
memory after the call, inconsistently, and managers have no way to check
the read against what was actually said.

### What this repo is not

Not a transcription tool, not a CRM, not an LLM wrapper. It does not accept
real customer data. It is a deterministic extraction engine demonstrated on
a synthetic, seeded corpus with a hidden ground-truth answer key, so
extraction accuracy is a measured number, not an assertion.

## Intended user

A sales engineer or RevOps-adjacent hiring manager skimming a portfolio —
evaluating information-extraction chops, not shopping for a sales tool.

## User journey

1. Land on the Call Library: every synthetic call in the corpus, sorted by
   MEDDICC completeness (how many of the 7 pillars were found), with a
   corpus-wide accuracy panel up top.
2. Open a call: turn-by-turn transcript, and all 7 pillars broken out —
   status (found / ambiguous / absent), the evidence line(s), the extracted
   value, confidence, and whether it matched the hidden ground truth.
3. Open Try It Yourself: paste free-text call notes or a transcript, run
   the same extractor client-side, see the 7-pillar read. No grading (no
   ground truth exists for arbitrary text), no upload, no key, no network
   call.

## MVP scope

- Full 7-pillar MEDDICC (no Paper Process / MEDDPICC extension).
- Deterministic regex/keyword extraction, zero LLM calls, zero required
  API key to run anything in the repo.
- Committed synthetic corpus: 50 seeded call transcripts. Each pillar's
  status is drawn independently per call — found / ambiguous / absent —
  so calls realistically vary in which signals came up at all.
- Per-pillar output: `status`, `value` (short canonical phrase, null unless
  found), `confidence` (high/medium/low, null unless found), `evidence`
  (quoted transcript lines).
- Two distinct numbers per call, deliberately not conflated:
  - **Completeness** (0–7): how many pillars the extractor itself calls
    "found" — the qualification read a rep would actually want.
  - **Field accuracy** (0–100%): how often the extracted read matches the
    call's own hidden ground truth — the "is this extractor any good"
    number, corpus-wide and per-call.
- 3 screens (Library / Call detail / Try It Yourself) + `GET /api/v1/records`
  + `GET /api/schema`.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript strict
(`noUncheckedIndexedAccess`) + Tailwind CSS 4 + zod at every boundary +
vitest + vite-node for tests/scripts. Deployed on Vercel. Zero dependency
exceptions — extraction is hand-rolled regex/keyword pattern matching, no
NLP library. Identical stack to `meeting-to-crm` / `title-normalizer`.

## Data sources

None external. `data/generate.ts` produces the entire corpus from a fixed
seed; the generated JSON is committed so the app never regenerates it at
runtime.

## System / architecture

Six downward-only dependency layers. Nothing below `app/` may import React,
HTTP, or DOM APIs.

```
data/               corpus generation (transcripts + embedded ground truth, seeded RNG) + committed JSON + zod load schema
  ↓
lib/domain/          Call, TranscriptLine, PillarSignal, GroundTruthRecord, ExtractedRecord, PillarGrade, CallGrade, CorpusAccuracy — types + zod
  ↓
lib/extraction/       one extractor per pillar (metrics, economic-buyer, decision-criteria, decision-process, identify-pain, champion, competition) + extractRecord
  ↓
lib/grading/           gradePillarField, gradeRecord, computeFieldAccuracy
  ↓
lib/meddicc/           orchestration — assembles the full result + CorpusAccuracy + completeness
  ↓
app/                    three screens (library, call detail, try-it) + /api/v1/records + /api/schema
```

### Rules of the architecture

- `lib/extraction/` and `lib/grading/` are pure and deterministic: same
  transcript ⇒ byte-identical `ExtractedRecord`; same extracted/ground-truth
  pair ⇒ byte-identical `CallGrade`. No `Date.now()`, no unseeded
  `Math.random()`.
- `extractRecord` runs identically in the browser (Try It Yourself) and on
  the server (precomputed library + API route) — no Node-only or DOM-only
  APIs below `app/`.
- Grading only ever runs against a call's own committed ground truth. The
  Try It Yourself page never imports `lib/grading/`.
- Confidence is assigned inside `lib/extraction/`, from properties of the
  match itself (which cue-strength tier fired) — never derived from whether
  the grader later judged the field correct.
- Completeness is computed from the **extracted** record only. Field
  accuracy is computed by comparing extracted vs ground truth. Nothing
  computes one from the other.

## Data model

```ts
type Speaker = "rep" | "prospect";
type TranscriptLine = { speaker: Speaker; speakerName: string; text: string };

type PillarStatus = "found" | "ambiguous" | "absent";
type FieldConfidence = "high" | "medium" | "low";
type Evidence = { lineIndex: number; quote: string };

const MEDDICC_PILLARS = [
  "metrics", "economicBuyer", "decisionCriteria", "decisionProcess",
  "identifyPain", "champion", "competition",
] as const;

// ground truth, baked in at generation time
type GroundTruthPillar = { status: PillarStatus; value: string | null };
type GroundTruthRecord = Record<(typeof MEDDICC_PILLARS)[number], GroundTruthPillar>;

// extractor output
type PillarSignal = {
  status: PillarStatus;
  value: string | null;              // canonical extracted phrase, null unless found
  confidence: FieldConfidence | null; // null unless found
  evidence: Evidence[];
};
type ExtractedRecord = Record<(typeof MEDDICC_PILLARS)[number], PillarSignal>;

type Call = {
  id: string;
  date: string;
  transcript: TranscriptLine[];
  groundTruth: GroundTruthRecord;
};

const FIELD_MATCHES = ["correct", "missed", "false-positive", "incorrect"] as const;
type PillarGrade = { pillar: (typeof MEDDICC_PILLARS)[number]; match: (typeof FIELD_MATCHES)[number] };
type CallGrade = { pillarGrades: PillarGrade[]; fieldAccuracy: number }; // 0–100, equal-weight over 7 pillars

type CallResult = { call: Call; extracted: ExtractedRecord; grade: CallGrade; completeness: number };
type CorpusAccuracy = {
  callCount: number;
  overallFieldAccuracy: number;
  byAmbiguityProfile: { clean: number; ambiguous: number }; // a call is "ambiguous" if any pillar's ground truth is ambiguous
};
type MeddiccResult = { generatedAt: string; callCount: number; calls: CallResult[]; corpusAccuracy: CorpusAccuracy };
```

## Method

### The corpus's generative model

`data/generate.ts`, seed fixed, 50 calls. For each call and each of the 7
pillars **independently**, draw a status by weight: absent 28%, ambiguous
12%, found-high 25%, found-medium 20%, found-low 15%.

- **absent** — no line for this pillar is emitted. Realistic: plenty of
  real calls never surface Economic Buyer or Competition at all.
- **found** (one of 3 confidence tiers) — one line is emitted from that
  tier's template bank, embedding a canonical value. Ground truth = that
  value. Strong-tier lines use unambiguous, on-the-nose phrasing; medium
  hedges; weak is a thin, passing mention — the same three-tier structure
  `meeting-to-crm`'s deal-stage extractor uses for strong vs. weak language,
  generalized to a graded rather than binary split.
- **ambiguous** — two lines are emitted, each asserting a different value
  for the same pillar with strong phrasing (two different numbers both
  claimed as "the" savings, two different people both claimed as final
  approver). Ground truth = ambiguous, value null.

Each pillar has its own value pool and line templates (numbers for Metrics;
`Name, Title` for Economic Buyer / Champion; a canonical phrase pool for
Decision Criteria / Decision Process / Identify Pain / Competition).

### Extraction rules

Every extractor follows the same shape: scan every transcript line; for
each of 3 cue-phrase tiers (strong/medium/weak), test whether the line
contains both a tier cue phrase and the pillar's value pattern (a regex
capture for Metrics/Economic Buyer/Champion, a literal pool-phrase match
for Decision Criteria/Decision Process/Identify Pain/Competition); collect
every distinct value found across all lines.

- 0 distinct values ⇒ `{ status: "absent", value: null, confidence: null }`.
- Exactly 1 distinct value ⇒ `{ status: "found", value, confidence: <tier> }`.
- ≥2 distinct values ⇒ `{ status: "ambiguous", value: null, confidence: null }`
  — a genuine conflict, not a guess at which value wins.

This is the same one-vs-many-matches branch `extractDealStage` uses in
`meeting-to-crm`, applied independently per pillar instead of once per call.

### Grading

`gradePillarField(extracted, groundTruth)`:

- both `absent` ⇒ `correct`.
- ground truth non-absent, extracted `absent` ⇒ `missed`.
- ground truth `absent`, extracted non-absent ⇒ `false-positive`.
- both `ambiguous` ⇒ `correct`.
- both `found` ⇒ `correct` iff `value` strings are equal, else `incorrect`.
- `found` vs `ambiguous` (either direction) ⇒ `incorrect`.

`fieldAccuracy` = round(100 × count(`correct`) / 7). `completeness` = count
of `status === "found"` in the **extracted** record (0–7) — computed
independently of grading.

## MEDDICC Extractor (app)

- **Library** (`/`) — corpus accuracy panel (overall / clean / ambiguous
  field accuracy), sortable table of 50 calls (completeness, field
  accuracy, date).
- **Call detail** (`/calls/[id]`) — transcript on one side, 7-pillar
  breakdown on the other: status badge, value, confidence badge, evidence
  quotes, match-vs-ground-truth badge.
- **Try It Yourself** (`/try-it`) — textarea, client-side `extractRecord`
  call, same 7-pillar panel with no grade badges (no ground truth exists).

## API surface

- `GET /api/v1/records` — the full precomputed `MeddiccResult` as JSON.
- `GET /api/schema` — `z.toJSONSchema(MeddiccResultSchema)`, rendered
  straight from the zod schema so it cannot drift from the implementation.

## Implementation task order

1. Scaffold: package.json, tsconfig, eslint, tailwind/postcss, next config,
   vitest config, `.gitignore`, LICENSE, git init, GitHub repo, first push.
2. `lib/domain/` types + zod schemas, with unit tests.
3. `data/generate.ts` (seeded corpus generator) + `scripts/corpus.mts` +
   committed `data/corpus.json` + `data/corpus.ts` loader + tests.
4. `lib/extraction/` — 7 pillar extractors + `record.ts` orchestrator, with
   unit tests per extractor covering found/ambiguous/absent/all 3 tiers.
5. `lib/grading/` — `gradePillarField`, `gradeRecord`, `computeFieldAccuracy`
   + tests.
6. `lib/meddicc/build-result.ts` orchestration + tests.
7. `scripts/sweep.mts` — 9 corpus-wide invariants, run to green.
8. `app/` — API routes, then Library, Call detail, Try It Yourself screens.
9. Styling pass (Tailwind, confidence/status color scale), screenshots.
10. `README.md` + `docs/plain-english-guide.md`.
11. Vercel deploy, live demo link back into README.
12. Final verification: build, typecheck, lint, test, sweep all green.

## Validation / test plan

- `npm test` — vitest over every `lib/**/*.test.ts` and `data/**/*.test.ts`.
- `npm run sweep` — 9 invariants: corpus size/uniqueness; non-degenerate
  status mix per pillar; field bounds (enums, 0–100, 0–7); evidence
  traceability (every quoted line index+text exists in that call's
  transcript); grading reproducibility; confidence calibration
  (high-confidence correct-rate > low-confidence correct-rate); difficulty
  realism (ambiguous-profile calls score lower than clean); competence
  floor (overall field accuracy ≥ 75); determinism (two generation runs and
  two pipeline runs byte-identical).
- Manual: exercise all 3 screens in a browser before calling it done.

## Deployment plan

Vercel, connected to the GitHub repo, production deploy. No environment
variables required.

## README plan

Standard structure from the portfolio's reusable README template. Live
demo link, plain-English guide link, `GET /api/v1/records` link.

## Definition of done

- All 3 screens work end to end against the committed corpus.
- `npm run build`, `typecheck`, `lint`, `test`, `sweep` all pass.
- Vercel prod deploy live, linked from README.
- README complete per the portfolio template, with at least one screenshot.

## Cut order if the day runs out

1. Try It Yourself screen (Library + detail carry the portfolio story alone).
2. Screenshots / polish pass.
3. `docs/plain-english-guide.md`.

Never cut: the corpus, the extractors, the grading, the sweep, or the
completeness/accuracy distinction — that's the whole point of the project.

## Post-MVP (not in this build)

- MEDDPICC (Paper Process) extension.
- Real transcript upload with PII handling.
- Per-pillar confidence calibration tuned against a held-out corpus split.

## Settled decisions

Recorded verbatim from the grilling session with the user, 2026-08-21:

1. Full 7-pillar MEDDICC, not MEDDPICC.
2. Deterministic extraction, zero LLM calls, zero required key.
3. Synthetic committed corpus + Try It Yourself free text; no upload.
4. Single-session time budget.
5. Stack identical to `meeting-to-crm` / `title-normalizer`.
6. New public GitHub repo `akshatiwarix/meddicc-extractor` + Vercel prod.
7. Transcripts only (no separate written-notes format).
8. 3-way per-pillar status: found / ambiguous / absent.
9. Completeness (0–7, from extracted record) kept separate from field
   accuracy (0–100%, extracted vs. ground truth).
10. 3-screen shape (Library / Call detail / Try It Yourself) +
    `/api/v1/records` + `/api/schema`, matching `meeting-to-crm`.
