# Meridian Payments

A small cross-border payments service with built-in compliance screening. All data is synthetic — Meridian Bank is fictional (BIC `DEMOVNVX` is not a real institution) and the repo contains no real customer or bank data.

```
POST /payments                    accept a payment instruction (simplified ISO 20022-flavored JSON)
                                  → validate (zod) → screen (blocklist + rules) → post to ledger → audit
GET  /accounts/:id                account summary
GET  /accounts/:id/transactions   full transaction history (no pagination)
GET  /screening/rules             list screening rules
POST /screening/rules             add a screening rule at runtime
GET  /audit                       append-only audit trail
GET  /health                      liveness
```

## Setup

```bash
npm install
npm test        # 16 tests, ~1s
npm run dev     # serve on :3000
npm run typecheck
```

## Conventions

1. **Money is ALWAYS an integer number of minor units.** Never floats. `VND` and `JPY` have **0** decimal places; `USD`/`EUR` have 2. See `src/domain/money.ts`.
2. **All timestamps are ISO-8601 UTC.**
3. **Every business action writes to the audit trail** (`src/domain/audit.ts`). Provenance is the product.
4. **Errors use the envelope** `{ "error": { "code", "message" } }` with stable, SCREAMING_SNAKE codes.
5. **zod for all input validation. No `any`.**

Repo ships with commit guardrails in `.githooks/` and agent personas in `templates/` (planner, payments-reviewer).
