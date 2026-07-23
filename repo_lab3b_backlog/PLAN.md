# PLAN — Large-Value Transaction Report (LVTR)

*Canonical example of Lab 2b's planner output (persona: templates/planner.md). Read: context/COMPLIANCE-HANDBOOK.md, context/LVTR-FILE-SPEC.md, src/domain/*, tests/*.*

**Goal:** generate the regulator's daily LVTR per MB-COMP-7 + LVTR-FILE-SPEC v1.3, exposed as `GET /reports/lvtr/:date`.

## Sub-tasks (dependency order)

1. **Business-date utility** (S) — `src/domain/business-date.ts`: UTC ISO → ICT (UTC+7) date; compact YYYYMMDD form. Done when: boundary case 17:30Z → next day passes.
2. **FX equivalence utility** (S) — `src/domain/fx.ts`: minor units → whole-VND equivalent via `data/fx-reference.json`, **rounded UP**, integer math only. Done when: HKD .5-VND case rounds up; VND passes through.
3. **Report builder** (M) — `src/domain/lvtr.ts`: filter DEBIT legs only (one row per payment) · business date match · VND-equiv ≥ 400,000,000 inclusive · sort by endToEndId · header/TXN/trailer format · audit entry `report.lvtr_generated`. Done when: byte-exact vs the file spec's worked example.
4. **Route** (S) — `src/routes/reports.ts`: `GET /reports/lvtr/:date`, date regex → 400 envelope; text/csv + content-disposition. Done when: route tests pass.
5. **Acceptance tests** (M) — from the success-kit criteria, committed BEFORE implementation.

## Risks / open questions (answered by context docs — do not assume)
- One row per payment vs per ledger leg → §4: payment (DEBIT leg). ✔
- Threshold inclusive? → §2: inclusive. ✔
- Rounding direction → §2: UP (fail conservative). ✔
- VND itself → no conversion; minor == VND. ✔

## Protected files (must not touch — .githooks/pre-commit)
`src/domain/audit.ts` · `data/blocklist.json` · `tests/money.test.ts` · `tests/payments.test.ts` · `tests/accounts.test.ts`
