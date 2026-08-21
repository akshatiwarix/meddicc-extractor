# MEDDICC Extractor — how it works, in plain English

No code in this one. If you've ever filled in a MEDDICC field in a CRM from
memory after a call and wondered how much that read was actually worth,
this is written for you.

## The problem, in one paragraph

MEDDICC — Metrics, Economic Buyer, Decision Criteria, Decision Process,
Identify Pain, Champion, Competition — is the checklist sales teams use to
judge how real a deal is. In practice, a rep fills it in from memory after
the call, under time pressure, and a manager reviewing the deal has no way
to check that read against what was actually said. Worse, most tracking
can't tell the difference between "this topic never came up" and "it came
up but stayed unclear" — two very different facts that both end up looking
like a blank field. This tool does both things a real qualification read
needs: it shows the evidence behind every pillar, and it keeps "found,"
"unclear," and "never came up" as three genuinely different answers.

## 1. Three answers, not two

Most extraction tools give you two outcomes: found, or not found. MEDDICC
needs a third. Imagine a call never mentions who controls the budget —
that's a real gap, worth flagging to a rep before they get surprised late
in the deal. Now imagine a different call where two people both claim to
be the final approver — that's not a gap, it's a genuine conflict, and the
honest answer is "unclear," not a coin-flip guess at which one is right.

This tool tracks all three: **found** (with the fact and its evidence),
**ambiguous** (with both conflicting claims shown side by side), and
**absent** (nothing said, plainly labeled "not mentioned"). Collapsing
those into a single "not filled in" bucket — which is what most CRM fields
do — throws away exactly the information a rep would want.

## 2. Every fact comes with its receipt

Imagine a tool tells you: "Economic Buyer: Maria Chen." Based on what? If
you can't see the sentence that led to that conclusion, you're being asked
to trust a black box.

Every pillar this tool extracts comes with the exact transcript line it
was pulled from, plus a confidence level — high, medium, or low — based on
how clean that evidence actually was. A name mentioned once in passing
gets low confidence; an explicit "she'll need to sign off on this" gets
high. Confidence is set by how the sentence was said, never by whether the
answer later turned out to be right — otherwise it would just be measuring
itself.

## 3. Two numbers, kept honestly separate

This tool reports two different numbers per call, and it's deliberate that
they don't get mixed together:

- **Completeness** — how many of the 7 pillars got a "found" read. This is
  the number a rep actually cares about day to day: how qualified does
  this deal look right now.
- **Field accuracy** — how often that read matches a known-correct answer.
  This is the "can I trust this tool" number.

Why keep them apart? A tool that always guessed "found" on every pillar
would score perfectly on completeness while being worthless — accuracy is
what catches that. And a tool that's accurate but timid (calling
everything "unclear" to avoid ever being wrong) would score perfectly on
accuracy while being useless — completeness is what catches that. Neither
number alone tells the whole story; showing both, separately, is what
makes each one honest.

## 4. "It works" should be a number, not a vibe

Every synthetic call in the built-in library was generated with a
known-correct answer already written down for every pillar. The extractor
never sees that answer — it just reads the transcript, the same way it
would for a real call. A separate step then compares what it found against
the real answer and produces a score.

Across the 50 calls in this demo, that score comes out to **81 out of
100** — and it's not the same everywhere. Calls with clean, unambiguous
conversations score **85**. Calls that were deliberately made harder score
**78**. That gap is the point: a tool that scored identically on easy and
hard calls would be suspicious — it would mean "difficulty" wasn't
connected to anything real about how the call actually went. Here, it is.

## 5. You can test it yourself, right now

The built-in library uses calls this tool wrote itself, so it can grade its
own homework. That's a fair question to raise — so there's a second page,
**Try It Yourself**, where you can type or paste your own fake call
transcript and watch the same extractor run on it, live, in your browser.
There's no accuracy score for what you type, on purpose: there's no way to
know the "right answer" for a transcript nobody but you wrote, so the tool
doesn't pretend to grade it.

## What this tool doesn't try to do

It doesn't use an AI language model — every extraction rule is a plain,
readable pattern match against known phrasing, not a black-box model call.
That's a deliberate tradeoff: it can't handle a completely novel way of
phrasing something the way an AI model might, but every decision it makes
can be read, understood, and tested — including by you, in the source
code. It doesn't save anything back into a real CRM — there's no write
path, nothing persisted beyond this demo. And it isn't a general call
transcription or meeting-notes product — it's a demonstration of what
evidence-linked, honestly-uncertain, measurably-accurate qualification
extraction looks like, built end to end.
