# Meridian Payments — agent instructions

- Stack: Node 20, TypeScript strict, Fastify, zod at every external boundary, Vitest.
- Money is ALWAYS integer minor units. Never floats. VND/JPY have 0 decimal places, USD/EUR/GBP/SGD/HKD have 2 (`src/domain/money.ts`).
- Before implementing or changing ANY compliance or reporting feature, read `context/COMPLIANCE-HANDBOOK.md` and `context/LVTR-FILE-SPEC.md` and follow them exactly.
- FX conversion uses `data/fx-reference.json` only — never invent or hardcode rates.
- All timestamps stored ISO-8601 UTC; ICT (UTC+7) applies only to business-date derivation, which lives in one dedicated,
  tested utility (`src/domain/business-date.ts` — create it there if it does not exist yet).
- Errors use `{ "error": { "code", "message" } }` with stable SCREAMING_SNAKE codes.
- Every business action writes an audit entry (`src/domain/audit.ts`).
- Tests are the contract: never edit tests to make them pass. TDD: failing tests first.
- Run `npm test` after every change; fix the implementation, not the tests.
- Small diffs; new chat per task.
