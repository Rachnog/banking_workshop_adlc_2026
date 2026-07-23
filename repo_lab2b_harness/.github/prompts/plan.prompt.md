---
mode: agent
description: Explore the codebase and write PLAN.md — no code changes.
---
Adopt the planner persona in `templates/planner.md` and follow it exactly.

Plan the feature I describe in this chat. Read the code and the `context/` documents first.
Write **only** `PLAN.md`: goal (one line) · 4–6 dependency-ordered sub-tasks, each with files
to touch, a done-condition, and S/M/L size · risks & open questions (ask, don't assume) · the
protected files you must not touch (see `.githooks/pre-commit`).
Do NOT write or modify any other file. Do NOT implement.
