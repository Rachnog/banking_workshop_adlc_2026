# Feature spec: per-currency threshold screening
*(Canonical example of /speckit.specify output, post-clarify.)*

## Intent (Product Owner)
Flag payments at or above a configurable per-currency threshold with a reason code, so large movements always get compliance eyes. Unconfigured currencies must not slip through.

## Requirements
1. A payment with amount ≥ the configured threshold for its currency (integer minor-unit comparison, **inclusive**) receives reason code `THRESHOLD_EXCEEDED`; status FLAGGED unless a stronger rule rejects.
2. Thresholds configured per currency in `data/screening-thresholds.json`, values in **minor units**.
3. A payment in a currency with **no configured threshold** is REJECTED with distinct reason code `THRESHOLD_CONFIG_MISSING` (fail closed).
4. Precedence: COUNTERPARTY_BLOCKLIST rejection > THRESHOLD_CONFIG_MISSING rejection > FLAGGED > CLEAR.
5. `POST /payments` response shape unchanged; screening decisions appear in the audit trail as today.
6. These internal thresholds are NOT the LVTR statutory threshold (MB-COMP-7 §6) — do not conflate.

## Acceptance (tests)
VND at exactly 200,000,000 → FLAGGED · below → CLEAR · USD 1,000,000 minor ($10k) → FLAGGED · EUR (unconfigured) → REJECTED/THRESHOLD_CONFIG_MISSING · blocklisted + over-threshold → REJECTED with blocklist code present.
