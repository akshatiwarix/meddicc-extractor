import type { PillarVocab } from "./types";

export const ECONOMIC_BUYER_VOCAB: PillarVocab = {
  strong: [
    { value: "Elena Diaz, CFO", template: "{V} will need to sign off before we can move forward." },
    { value: "Marcus Whitfield, CEO", template: "{V} ultimately owns the budget for this." },
    { value: "Priya Menon, VP of Finance", template: "{V} has the final say on this purchase." },
  ],
  medium: [
    { value: "Rachel Kim, Chief Revenue Officer", template: "I think {V} has some say in the budget, though I'm not certain." },
    { value: "David Ortiz, COO", template: "{V} is probably involved in approving this somehow." },
  ],
  weak: [
    { value: "Nina Osei, CFO", template: "{V} might be looped in on approvals at some point." },
    { value: "Tom Baxter, VP of Finance", template: "Not sure how involved {V} will end up being." },
  ],
};
