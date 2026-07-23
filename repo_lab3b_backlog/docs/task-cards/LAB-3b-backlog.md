# LAB-3b — Decompose, delegate, and the delivery pipeline

**Watched in the demo (trainer env):**
1. **Tasks → backlog:** `/speckit.taskstoissues` turns the 4a `tasks.md` into real GitHub
   issues (via the GitHub MCP server) — acceptance criteria preserved, sub-issues under a
   parent, Projects board as the shared view. A well-written issue is a spec for someone
   else's agent.
2. **Delegate:** assign one issue to the **Copilot coding agent**. Watch the pipeline it
   triggers: dedicated `copilot/...` branch → draft PR → **"Start MCP Servers" log step**
   (the agent's own MCP config lives in repo Settings → Copilot → cloud agent; secrets as
   `COPILOT_MCP_*`) → CI runs the same `ci.yml` as humans — after a human clicks
   **"Approve and run workflows"** (agents don't get free CI).
3. **Branching & gates = the delivery model:** trunk-based; agent branches are ordinary
   branches; branch protection requires green CI + human review to merge. The agent never
   merges. This is CI/CD for the agentic SDLC: same pipeline, same gates, any author.
4. **Jira (GA since June 2026):** assign a Jira issue to GitHub Copilot from the assignee
   dropdown (or @mention it) → the agent reads the issue + comments, opens a draft PR,
   streams status back into the Jira panel, and takes follow-up instructions from Jira chat.
   Setup = "GitHub Copilot for Jira" Atlassian Marketplace app + GitHub app + org connect.
   **In a regulated org: pending security review → InfoSec checklist.** The pattern is tracker-agnostic.

**Your 5 minutes (breakouts):** create the idempotency issue from
`docs/issues/idempotency-well-specified.md` (workshop-task template) and assign it to the
coding agent. The deliberately vague "improve error handling" issue is also being assigned —
on purpose. Both PRs land during 4c.

**Output:** one issue delegated per breakout; issue-decomposition + `taskstoissues` as take-homes.
**Fallback (no GHEC):** decomposition demo runs (agent mode + issue templates); delegation is
the pre-recorded demo; minutes flow to 4c triage.
