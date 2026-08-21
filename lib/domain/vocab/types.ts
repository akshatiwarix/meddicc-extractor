/**
 * A curated (value, sentence-template) pair. `template` contains the literal
 * marker `{V}` exactly once; the generator fills it with `value` to emit a
 * transcript line, and the extractor's regex (built from the same template)
 * captures whatever sits in that slot back out. Pairing value and template
 * together — instead of crossing an arbitrary value pool with an arbitrary
 * template pool — keeps every generated sentence grammatical.
 */
export type VocabLine = {
  value: string;
  template: string;
};

/** One confidence tier's bank of curated lines for a single MEDDICC pillar. */
export type PillarVocab = {
  strong: VocabLine[];
  medium: VocabLine[];
  weak: VocabLine[];
};
