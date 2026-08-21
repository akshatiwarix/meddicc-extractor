import type { PillarVocab } from "./types";

export const METRICS_VOCAB: PillarVocab = {
  strong: [
    { value: "$120K", template: "That would save us {V} a year in operating costs." },
    { value: "$250K", template: "We're projecting {V} in additional revenue from this." },
    { value: "18%", template: "This could increase our conversion rate by {V}." },
    { value: "15 hours", template: "That would free up {V} a week for the team." },
  ],
  medium: [
    { value: "$80K", template: "Roughly speaking, we might see something like {V}, though it's early to say." },
    { value: "10%", template: "It's hard to pin down, but maybe around {V} improvement." },
  ],
  weak: [
    { value: "$50K", template: "Someone mentioned a number, maybe {V}, but I wasn't in that meeting." },
    { value: "a few hours", template: "I heard it could save {V} here and there, nothing concrete." },
  ],
};
