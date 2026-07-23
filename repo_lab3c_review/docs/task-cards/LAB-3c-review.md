# LAB-3c — The review loop (three loops, honestly)

Claude Code has `/loop`-style commands. Copilot does NOT ship one — the loops live in
three places, and you now have all three:

- **L1 — editor loop:** `/loop` prompt file (in this repo) — iterate implementation until
  `npm test` is green, bounded at 5 attempts, tests untouchable. You effectively built this
  in Lab 2c; now it's a reusable command.
- **L2 — PR loop:** Copilot Code Review → YOU triage → `@copilot` comment → follow-up
  commits on the same PR → re-request review. Bounded by policy: max 2 cycles, then a human
  decides. Neutral prompts only.
- **L3 — pipeline loop:** the coding agent's internal iterate-until-tests-pass (it runs the
  suite, diagnoses, revises — and flags ambiguity instead of looping forever); CI red on its
  PR? `@copilot` "CI is failing, fix the implementation" continues the same PR.

**Your 12 minutes:**
1. On your 4a PR: run **Copilot Code Review** + generate the **PR summary** (the artifact
   your PM/PO/QA can actually read). Triage every comment: accept / reject-with-reason /
   escalate.
2. Run ONE L2 cycle: `@copilot` — "Address the accepted review findings. CI must stay green.
   Do not touch tests." Watch the follow-up commits land on the same PR. Re-request review.
3. The reveal: the morning cold-open PR + your 4b delegated PRs are in. Review them with the
   same discipline; pass a human verdict (approve / request-changes with reasons). Compare
   what the well-specified issue produced vs the vague one.

**Success check:** one triaged Code Review + one completed L2 cycle + one human verdict on an
agent PR.
**The rule that makes loops safe:** every loop has an exit condition a human wrote, a bound,
and gates it cannot cross (hooks, protected tests, branch protection, CI).
