/**
 * A curated (value, sentence-template) pair. `template` contains the literal
 * marker `{V}` exactly once; the generator fills it with `value` to emit a
 * transcript line, and the extractor's regex (built from the same template)
 * captures whatever sits in that slot back out — so `value` is always what
 * gets extracted. Pairing value and template together — instead of crossing
 * an arbitrary value pool with an arbitrary template pool — keeps every
 * generated sentence grammatical.
 *
 * `groundTruthValue`, when present, is what the corpus records as the
 * correct answer instead of `value`. Used only on a handful of weak-tier
 * lines: a thin, hedged mention genuinely can name the wrong specific (a
 * rounder number, a vaguer phrase) even though something real was said —
 * the honest source of the low tier's imperfect accuracy, not a bug.
 */
export type VocabLine = {
  value: string;
  template: string;
  groundTruthValue?: string;
};

/** One confidence tier's bank of curated lines for a single MEDDICC pillar. */
export type PillarVocab = {
  strong: VocabLine[];
  medium: VocabLine[];
  weak: VocabLine[];
};
