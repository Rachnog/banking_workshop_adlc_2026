# repo_lab3c_review — The three review loops (Part 3c)

> Catch-up / starting-state repo. If you completed the previous lab in your own clone, KEEP USING YOUR CLONE — this repo is for joining fresh or recovering.

## Students — run it

```bash
npm install     # locked-down machines: skip — node_modules ships vendored
npm test        # must be green before you start
git config core.hooksPath .githooks   # activates the commit guardrails (done live in Lab 2b)
```

Open the task card: **LAB-3c-review.md** (in `docs/task-cards/`). Work on a branch: `git checkout -b work/<your-name>`.

**Already done for you in this snapshot:**
- Everything through 4b (25 tests green).
- Branch `feature/statement-export` contains a PLANTED flawed change — open it as a PR and review it.

## Trainer — GitHub-side setup for this repo
- Push as `repo_lab3c_review` WITH branches (`git push --all`). REQUIRED:
  - [ ] Open a PR from `feature/statement-export` (the review-bait: floats, local-time dates, missing audit).
  - [ ] Enable Copilot Code Review on the repo.
  - [ ] If GHEC: pre-assign one issue to the coding agent so an agent PR exists to verdict.
