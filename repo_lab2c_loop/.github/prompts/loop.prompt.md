---
description: "Self-refining loop: iterate implementation until the test suite is green. Copilot's answer to Claude Code's /loop."
---

Run `npm test`.

If anything is red:
1. Read the failure output carefully.
2. Fix the IMPLEMENTATION only — you may never modify anything under `tests/`, `context/`, or the files protected by `.githooks/pre-commit`.
3. Re-run `npm test`.

Repeat until the suite is fully green, or you have made 5 attempts.

If you reach 5 attempts without green: STOP. Do not try workarounds. Report:
- which tests still fail,
- your best hypothesis for why,
- what ambiguity or missing information is blocking you (check the spec and `context/` documents first).

When green: summarize what changed in ≤5 bullet points and stop.
