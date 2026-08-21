import { Rng, derive } from "@/lib/rng";
import type { Call, GroundTruthPillar, GroundTruthRecord } from "@/lib/domain/call";
import type { TranscriptLine } from "@/lib/domain/transcript";
import { MEDDICC_PILLARS, type MeddiccPillar } from "@/lib/domain/pillars";
import { PILLAR_VOCAB, type VocabLine } from "@/lib/domain/vocab";

export const SEED = 24;
export const CALL_COUNT = 50;

// Per-pillar status weights: absent / ambiguous / found-high / found-medium / found-low.
// Sums to 100. See PLAN.md § Method — status is drawn independently per pillar per call.
const STATUS_WEIGHTS = [28, 12, 25, 20, 15] as const;

// ---------------------------------------------------------------------------
// Scene-setting word lists (not read by any extractor — flavor only)
// ---------------------------------------------------------------------------

const COMPANY_PREFIXES = [
  "Brightline", "Fern", "Cinder", "Loom", "Harbor", "Kestrel", "Maple", "Onyx",
  "Palisade", "Quill", "Rivet", "Sable", "Talon", "Umbra", "Verve", "Wayfarer",
  "Yarrow", "Amber", "Birchwood", "Cobalt",
] as const;

const COMPANY_SUFFIXES = [
  "Robotics", "Cloud", "Systems", "Analytics", "Health", "Financial",
  "Logistics", "Networks", "Dynamics", "Labs", "Software", "Digital",
  "Industries", "Partners", "Technologies", "Data", "Works", "Group",
] as const;

const PROSPECT_FIRST_NAMES = [
  "Jordan", "Casey", "Morgan", "Alexis", "Riley", "Devon", "Harper", "Skyler",
  "Quinn", "Reese", "Emerson", "Rowan", "Avery", "Sage", "Blair", "Dakota",
] as const;

const PROSPECT_LAST_NAMES = [
  "Alvarez", "Nakamura", "Fitzgerald", "Boateng", "Petrov", "Sinclair",
  "Okafor", "Larsson", "Delgado", "Hutchins", "Marchetti", "Wren",
] as const;

const PROSPECT_TITLES = [
  "Director of Operations", "Head of Revenue", "VP of Sales", "Director of IT",
  "Head of Growth", "VP of Customer Success",
] as const;

const REP_NAMES = ["Sam", "Jordan", "Taylor", "Morgan", "Casey", "Alex"] as const;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function makeCompanyName(rng: Rng, used: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const name = `${rng.pick(COMPANY_PREFIXES)} ${rng.pick(COMPANY_SUFFIXES)}`;
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
  }
  const fallback = `${rng.pick(COMPANY_PREFIXES)} ${rng.pick(COMPANY_SUFFIXES)} ${used.size}`;
  used.add(fallback);
  return fallback;
}

/** Days since epoch offset from a fixed narrative base date, never the real current date. */
function syntheticDate(offsetDays: number): string {
  const base = Date.UTC(2026, 0, 5); // 2026-01-05
  const d = new Date(base + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

type PillarOutcome =
  | { kind: "absent" }
  | { kind: "found"; line: VocabLine }
  | { kind: "ambiguous"; lines: [VocabLine, VocabLine] };

/** Picks two distinct indices into `pool` (needs at least 2 entries). */
function pickTwoDistinct<T>(rng: Rng, pool: readonly T[]): [T, T] {
  const i = rng.int(pool.length);
  let j = rng.int(pool.length);
  while (j === i) j = rng.int(pool.length);
  return [pool[i]!, pool[j]!];
}

function drawPillarOutcome(statusRng: Rng, valueRng: Rng, pillar: MeddiccPillar): PillarOutcome {
  const vocab = PILLAR_VOCAB[pillar];
  const idx = statusRng.weightedIndex(STATUS_WEIGHTS);
  if (idx === 0) return { kind: "absent" };
  if (idx === 1) {
    const [a, b] = pickTwoDistinct(valueRng, vocab.strong);
    return { kind: "ambiguous", lines: [a, b] };
  }
  const tier = idx === 2 ? vocab.strong : idx === 3 ? vocab.medium : vocab.weak;
  return { kind: "found", line: valueRng.pick(tier) };
}

function groundTruthFor(outcome: PillarOutcome): GroundTruthPillar {
  if (outcome.kind === "absent") return { status: "absent", value: null };
  if (outcome.kind === "ambiguous") return { status: "ambiguous", value: null };
  return { status: "found", value: outcome.line.value };
}

// ---------------------------------------------------------------------------
// Call generation
// ---------------------------------------------------------------------------

type Rngs = {
  company: Rng;
  prospectName: Rng;
  prospectTitle: Rng;
  rep: Rng;
  date: Rng;
  status: Record<MeddiccPillar, Rng>;
  value: Record<MeddiccPillar, Rng>;
};

function makeRngs(): Rngs {
  return {
    company: new Rng(derive(SEED, "company-name")),
    prospectName: new Rng(derive(SEED, "prospect-name")),
    prospectTitle: new Rng(derive(SEED, "prospect-title")),
    rep: new Rng(derive(SEED, "rep-name")),
    date: new Rng(derive(SEED, "date")),
    status: Object.fromEntries(
      MEDDICC_PILLARS.map((pillar) => [pillar, new Rng(derive(SEED, `${pillar}-status`))]),
    ) as Record<MeddiccPillar, Rng>,
    value: Object.fromEntries(
      MEDDICC_PILLARS.map((pillar) => [pillar, new Rng(derive(SEED, `${pillar}-value`))]),
    ) as Record<MeddiccPillar, Rng>,
  };
}

function generateCall(index: number, rngs: Rngs, usedCompanies: Set<string>): Call {
  const id = `call-${String(index + 1).padStart(3, "0")}`;
  const date = syntheticDate(rngs.date.intBetween(0, 90));
  const company = makeCompanyName(rngs.company, usedCompanies);
  const repName = rngs.rep.pick(REP_NAMES);
  const prospectName = `${rngs.prospectName.pick(PROSPECT_FIRST_NAMES)} ${rngs.prospectName.pick(PROSPECT_LAST_NAMES)}`;
  const prospectTitle = rngs.prospectTitle.pick(PROSPECT_TITLES);

  const transcript: TranscriptLine[] = [];
  const pushRep = (text: string) => transcript.push({ speaker: "rep", speakerName: repName, text });
  const pushProspect = (text: string) => transcript.push({ speaker: "prospect", speakerName: prospectName, text });

  pushRep("Thanks for hopping on the call today, glad we could find the time.");
  pushProspect(`This is ${prospectName}, I'm the ${prospectTitle} here at ${company}.`);

  const groundTruth = {} as GroundTruthRecord;
  for (const pillar of MEDDICC_PILLARS) {
    const outcome = drawPillarOutcome(rngs.status[pillar], rngs.value[pillar], pillar);
    groundTruth[pillar] = groundTruthFor(outcome);
    if (outcome.kind === "found") {
      pushProspect(outcome.line.template.replace("{V}", outcome.line.value));
    } else if (outcome.kind === "ambiguous") {
      for (const vocabLine of outcome.lines) {
        pushProspect(vocabLine.template.replace("{V}", vocabLine.value));
      }
    }
  }

  pushProspect("Sounds good, appreciate the time today.");

  return { id, date, transcript, groundTruth };
}

export function generateCorpus(): { calls: Call[] } {
  const rngs = makeRngs();
  const usedCompanies = new Set<string>();
  const calls: Call[] = [];
  for (let i = 0; i < CALL_COUNT; i++) {
    calls.push(generateCall(i, rngs, usedCompanies));
  }
  return { calls };
}
