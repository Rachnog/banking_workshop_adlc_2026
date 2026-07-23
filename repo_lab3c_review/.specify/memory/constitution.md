# Meridian Payments Constitution

## Core Principles

### I. Money Is Integer Minor Units (NON-NEGOTIABLE)
All monetary amounts are integer minor units end-to-end. Never floats, never decimal
arithmetic on strings. Currency decimals come from `CURRENCY_DECIMALS` (`src/domain/money.ts`);
VND and JPY have 0 decimal places, USD/EUR/GBP/SGD/HKD have 2. Display formatting happens
only at the edge via `fromMinorUnits`.

### II. Compliance Documents Are Law
Before implementing or changing any compliance or reporting feature, read
`context/COMPLIANCE-HANDBOOK.md` and `context/LVTR-FILE-SPEC.md` and follow them exactly.
FX conversion uses `data/fx-reference.json` only — rates are never invented or hardcoded.
Screening thresholds (internal risk appetite) and the LVTR statutory threshold are different
numbers with different purposes; never conflate them.

### III. Test-First, Tests Are the Contract (NON-NEGOTIABLE)
TDD strictly: acceptance criteria → failing tests → implement to green. The implementing
agent NEVER edits tests to make them pass; modified-tests-in-diff is a review blocker.
Protected files (audit trail, blocklist, seeded tests) are enforced by `.githooks/pre-commit`.

### IV. Every Business Action Is Audited
Any code path that moves money, screens a payment, or generates a report writes an audit
entry (`src/domain/audit.ts`). Provenance is the product: issue → plan → PR → checks →
review → merge must be reconstructable.

### V. Errors Are a Stable Contract
Every failure uses `{ "error": { "code", "message" } }` with SCREAMING_SNAKE codes. Codes
are append-only — renaming or removing a code is a breaking change requiring a spec update.

## Additional Constraints

- Stack: Node 20+, TypeScript strict, Fastify, zod at every external boundary, Vitest.
- In-memory persistence only in this phase; no new runtime dependencies without a plan-phase
  justification.
- All timestamps stored ISO-8601 UTC; business-date logic (ICT) lives in one utility, tested.

## Development Workflow

- Feature work follows Spec Kit: constitution → specify → clarify → plan → tasks → implement,
  with `/speckit.analyze` before implementation.
- Small, reviewable diffs; one sub-task per commit where practical.
- Copilot Code Review runs on every PR; a human passes the final verdict. Agents draft,
  humans merge, write-actions get gates.

**Version**: 1.0.0 | **Ratified**: 2026-07-10 | **Last Amended**: 2026-07-10
