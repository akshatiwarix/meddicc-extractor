import type { PillarVocab } from "./types";

export const DECISION_CRITERIA_VOCAB: PillarVocab = {
  strong: [
    { value: "SOC 2 compliance", template: "{V} is a hard requirement for us — we can't move forward without it." },
    { value: "single sign-on support", template: "{V} is non-negotiable on our side." },
    { value: "a dedicated Salesforce integration", template: "We flat out need {V}, no exceptions." },
  ],
  medium: [
    { value: "sub-second response times", template: "{V} would be nice to have — it's on our checklist." },
    { value: "a named customer success manager", template: "We're hoping for {V}, though it's not a dealbreaker." },
  ],
  weak: [
    // A vague raised idea genuinely isn't the same specific requirement as the settled one.
    { value: "on-prem deployment", groundTruthValue: "a self-hosted option", template: "Someone raised the idea of needing {V}, not sure if we truly need it." },
    { value: "multi-language support", groundTruthValue: "localization support", template: "{V} might matter down the line, but it's vague right now." },
  ],
};
