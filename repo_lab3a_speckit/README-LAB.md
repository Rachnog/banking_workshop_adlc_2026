# repo_lab3a_speckit — Spec-driven development with Spec Kit (Part 3a)

> Catch-up / starting-state repo. If you completed the previous lab in your own clone, KEEP USING YOUR CLONE — this repo is for joining fresh or recovering.

## Students — run it

```bash
npm install     # locked-down machines: skip — node_modules ships vendored
npm test        # must be green before you start
git config core.hooksPath .githooks   # activates the commit guardrails (done live in Lab 2b)
```

Open the task card: **LAB-3a-speckit.md** (in `docs/task-cards/`). Work on a branch: `git checkout -b work/<your-name>`.

**Already done for you in this snapshot:**
- The ENTIRE morning: context, plan, and a green LVTR implementation (`src/domain/lvtr.ts` + acceptance tests, 20 tests).
- Spec Kit pre-initialized (`/speckit.*` commands, seeded constitution).

## Trainer — GitHub-side setup for this repo
- Push as `repo_lab3a_speckit`. Verify 20 tests green. Threshold screening NOT implemented (that's the lab).
