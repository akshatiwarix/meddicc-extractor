import type { PillarVocab } from "./types";

export const IDENTIFY_PAIN_VOCAB: PillarVocab = {
  strong: [
    { value: "manual reporting eating up 10 hours a week", template: "The real problem for us is {V}." },
    { value: "deals slipping through the cracks", template: "What's really killing us is {V}." },
    { value: "our current tool constantly going down", template: "We're losing deals because of {V}." },
  ],
  medium: [
    { value: "duplicate data across three systems", template: "It's kind of an issue that we have {V}." },
    { value: "missed follow-ups", template: "It's somewhat frustrating that we keep having {V}." },
  ],
  weak: [
    // Downplayed as "mildly annoying" genuinely undersells what the real pain turns out to be.
    { value: "a bit of manual copy-pasting", groundTruthValue: "hours of manual copy-pasting weekly", template: "I guess it's mildly annoying that there's {V} involved." },
    { value: "occasional sync issues", groundTruthValue: "recurring data sync failures", template: "Not a huge deal, but there are {V} sometimes." },
  ],
};
