import type { PillarVocab } from "./types";

export const CHAMPION_VOCAB: PillarVocab = {
  strong: [
    { value: "Grace Feldman, Sales Ops Manager", template: "{V} has been championing this internally." },
    { value: "Owen Castillo, Team Lead", template: "{V} is really pushing for this on our side." },
    { value: "Maya Torres, Product Manager", template: "{V} has been selling this internally for us." },
  ],
  medium: [
    { value: "Leo Bennett, Senior Analyst", template: "{V} seems supportive of this so far." },
    { value: "Zoe Whitaker, Operations Lead", template: "{V} has been fairly positive about it, from what I've seen." },
  ],
  weak: [
    { value: "Ethan Voss, Team Lead", template: "{V} mentioned it once in passing, nothing more than that." },
    { value: "Sophia Reyes, Senior Analyst", template: "{V} might be open to it, but I'm not sure." },
  ],
};
