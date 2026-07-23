# Meridian Payments — workshop repo

> **Everything here is fictional.** Meridian Bank does not exist (BIC `DEMOVNVX` is fake), every customer is synthetic, and this repository contains **no real bank code, data, or business rules**. It exists for one purpose: a full-day hands-on workshop on agentic software development with GitHub Copilot.

A small cross-border payments service with built-in compliance screening:

```
POST /payments            accept a payment instruction (simplified ISO 20022-flavored JSON)
                          → validate (zod) → screen (blocklist + rules) → post to ledger → audit
GET  /accounts/:id        account summary
GET  /accounts/:id/transactions   full history  ⚠ no pagination (yet — that's your job)
GET  /screening/rules     list screening rules
POST /screening/rules     add a screening rule at runtime
GET  /audit               append-only audit trail
GET  /health              liveness + fictional-bank banner
```

## Setup

```bash
npm install        # (workshop machines: node_modules ships vendored — skip this)
npm test           # 16 tests, ~1s
npm run dev        # serve on :3000
npm run typecheck
```

## House rules (the ones the agent keeps breaking)

1. **Money is ALWAYS an integer number of minor units.** Never floats. `VND` and `JPY` have **0** decimal places; `USD`/`EUR` have 2. See `src/domain/money.ts`.
2. **All timestamps are ISO-8601 UTC.**
3. **Every business action writes to the audit trail** (`src/domain/audit.ts`). Provenance is the product.
4. **Errors use the envelope** `{ "error": { "code", "message" } }` with stable, SCREAMING_SNAKE codes.
5. **zod for all input validation. No `any`.**

*(Yes — these five lines are instructions-file material. That is Lab 2a.)*

> Repo ships with commit guardrails in `.githooks/` (activated during the workshop) and
> agent personas in `templates/` (planner, payments-reviewer, test-writer).

## Workshop task cards

This catch-up repo ships the card for its own step in [`docs/task-cards/`](docs/task-cards/): [`LAB-3b-backlog.md`](docs/task-cards/LAB-3b-backlog.md), with prompts, success checks, and stretch goals. The Lab 3a spec is [`docs/SPEC-threshold-screening.md`](docs/SPEC-threshold-screening.md).
