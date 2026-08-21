import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateCorpus } from "../data/generate";

const corpus = generateCorpus();

const outPath = fileURLToPath(new URL("../data/corpus.json", import.meta.url));
writeFileSync(outPath, JSON.stringify(corpus, null, 2) + "\n");

console.log(`calls: ${corpus.calls.length}`);
console.log(`wrote ${outPath}`);
