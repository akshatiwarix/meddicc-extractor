import type { PillarVocab } from "./types";

export const DECISION_PROCESS_VOCAB: PillarVocab = {
  strong: [
    { value: "security review, then legal, then a signature", template: "Our process from here is {V}." },
    { value: "board approval next month", template: "The next step is {V} — that's the last gate." },
    { value: "procurement sign-off after the pilot", template: "Before we can sign, we need {V}." },
  ],
  medium: [
    { value: "three more stakeholder demos", template: "I think the process involves {V}, roughly." },
    { value: "a 30-day evaluation period", template: "It usually goes through {V}, from what I understand." },
  ],
  weak: [
    { value: "some internal sign-off", template: "There's probably {V} needed, not totally sure what happens after this." },
    { value: "another round of reviews", template: "I guess there's {V}, but I don't know the details." },
  ],
};
