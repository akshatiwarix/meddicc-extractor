import type { PillarVocab } from "./types";

export const COMPETITION_VOCAB: PillarVocab = {
  strong: [
    { value: "Vendor A", template: "We're also evaluating {V} alongside your product." },
    { value: "RivalCorp", template: "We're currently using {V} and comparing it to yours." },
    { value: "anyone else", template: "Honestly, we're not evaluating {V} — you're the only one we're talking to." },
  ],
  medium: [
    { value: "CompeteCo", template: "We might take a look at {V} too, haven't decided." },
    { value: "LegacyStack", template: "Someone suggested we compare this to {V}." },
  ],
  weak: [
    { value: "a couple of other tools", template: "I heard we might check out {V}, but not seriously." },
    { value: "something from a past project", template: "Someone mentioned {V}, though it barely came up." },
  ],
};
