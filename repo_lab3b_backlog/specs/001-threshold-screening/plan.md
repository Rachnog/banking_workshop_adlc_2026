# Implementation plan
*(Canonical /speckit.plan output.)*
Extend `screen()` in `src/domain/screening.ts` (single seam). Load thresholds like blocklist. No new dependencies. Tests in `tests/screening.test.ts` written first (unit-level, direct `screen()` calls). Constitution gates: minor-units only, fail-closed, tests-are-contract.
