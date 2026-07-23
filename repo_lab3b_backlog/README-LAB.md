# repo_lab3b_backlog — Decompose, delegate, pipeline (Part 3b)

> Catch-up / starting-state repo. If you completed the previous lab in your own clone, KEEP USING YOUR CLONE — this repo is for joining fresh or recovering.

## Students — run it

```bash
npm install     # locked-down machines: skip — node_modules ships vendored
npm test        # must be green before you start
git config core.hooksPath .githooks   # activates the commit guardrails (done live in Lab 2b)
```

Open the task card: **LAB-3b-backlog.md** (in `docs/task-cards/`). Work on a branch: `git checkout -b work/<your-name>`.

**Already done for you in this snapshot:**
- Everything through 4a: LVTR green + threshold screening implemented via Spec Kit (25 tests).
- Canonical Spec Kit artifacts in `specs/001-threshold-screening/` (spec/plan/tasks) — feed `tasks.md` to `/speckit.taskstoissues`.

## Trainer — GitHub-side setup for this repo
- Push as `repo_lab3b_backlog`. REQUIRED GitHub-side setup:
  - [ ] Enable Copilot coding agent on the repo; MCP config in Settings → Copilot → cloud agent (see EXERCISES.md).
  - [ ] Create issues from `docs/issues/*.md` using the workshop-task template (or let `/speckit.taskstoissues` create the screening ones live).
  - [ ] Projects board with the issues.
  - [ ] `ci.yml` present — make it a required status check via branch protection.
