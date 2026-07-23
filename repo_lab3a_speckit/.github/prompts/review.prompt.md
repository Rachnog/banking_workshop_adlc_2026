---
mode: agent
description: Run the payments-reviewer persona on the current diff.
---
Adopt the reviewer persona in `templates/payments-reviewer.md` and follow it exactly.

Review the current working-tree diff (`git diff` plus `git diff --cached`; if clean, diff the
current branch against `main`). Search for and report ALL findings — do not stop at the first.
For each: `file:line` · severity (BLOCKER / MAJOR / MINOR) · one-sentence defect description ·
suggested fix. Pay particular attention to the money, timezone, audit, and error-contract
house rules. Report only — do NOT edit any file.
