# SPEC — Per-currency threshold screening (Lab 3a)

*A spec is a document for a machine: precise, testable, no prose padding.*

## High-Level Objective

Flag payments at or above a configurable per-currency threshold with a reason code, so large movements always get compliance eyes.

## Mid-Level Objectives (measurable)

1. A payment whose amount is **≥ the configured threshold for its currency** receives reason code `THRESHOLD_EXCEEDED` and status `FLAGGED` (unless another rule already rejects it).
2. Thresholds are **configured per currency** in `data/screening-thresholds.json` (create it; format below).
3. A payment in a currency **with no configured threshold** is **REJECTED** with the distinct reason code `THRESHOLD_CONFIG_MISSING` — fail closed, never fail open.
4. Threshold comparison uses **integer minor units** (house rule #1). No floats anywhere.
5. Every threshold decision (flag or reject) appears in the audit trail.

## Implementation Notes

- Stack: TypeScript, in `src/domain/screening.ts` (extend `screen()`); config loaded like `blocklist.json`.
- Threshold config format: `{ "VND": 200000000, "USD": 1000000 }` — values are **minor units** (VND has 0 decimals, USD has 2 — so `1000000` = USD 10,000.00).
- Reason codes are stable, SCREAMING_SNAKE, and covered by tests.
- Rejection precedence: blocklist REJECTED > threshold-config-missing REJECTED > FLAGGED > CLEAR.
- Do not change the API shape of `POST /payments` responses.

## Context

- Beginning files: `src/domain/screening.ts`, `data/blocklist.json`, `tests/payments.test.ts` (patterns to follow).
- Ending files: the above + `data/screening-thresholds.json` + new tests.

## Low-Level Tasks (ordered)

1. **Create `data/screening-thresholds.json`** seeded with VND and USD values above.
2. **Extend `screen()`** in `src/domain/screening.ts`: load thresholds; apply objectives 1 and 3 with the stated precedence.
3. **Write tests first** (they must fail before implementation): VND at threshold → FLAGGED; VND below → CLEAR; USD above → FLAGGED; EUR (no config) → REJECTED with `THRESHOLD_CONFIG_MISSING`; blocklist still wins over threshold.
4. **Wire audit**: threshold decisions appear in `payment.screened` audit details.

## Acceptance = the test suite

The agent implements until the tests you generated from this spec pass. **The agent may not edit the tests.**
