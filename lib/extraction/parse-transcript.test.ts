import { describe, expect, it } from "vitest";
import { parseTranscriptText } from "./parse-transcript";

describe("parseTranscriptText", () => {
  it("parses well-formed lines", () => {
    const { transcript, skippedLineCount } = parseTranscriptText(
      "Sam (rep): Thanks for hopping on the call.\nElena Diaz (prospect): This is Elena.",
    );
    expect(skippedLineCount).toBe(0);
    expect(transcript).toEqual([
      { speaker: "rep", speakerName: "Sam", text: "Thanks for hopping on the call." },
      { speaker: "prospect", speakerName: "Elena Diaz", text: "This is Elena." },
    ]);
  });

  it("ignores blank lines and skips malformed ones", () => {
    const { transcript, skippedLineCount } = parseTranscriptText(
      "Sam (rep): Hello.\n\nnot a valid line\nElena (prospect): Hi there.",
    );
    expect(transcript).toHaveLength(2);
    expect(skippedLineCount).toBe(1);
  });
});
