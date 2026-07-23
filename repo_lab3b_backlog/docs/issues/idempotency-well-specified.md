# Issue (well-specified — assign to Copilot coding agent): Idempotency keys on POST /payments

## Problem
Retrying the same payment instruction posts the money twice. `tests/payments.test.ts` documents this under "KNOWN GAP".

## Desired behavior
1. `POST /payments` accepts an optional `Idempotency-Key` header (string, 1–64 chars).
2. First request with a key: processed normally; response stored (status code + body) against the key.
3. Replay with the same key AND identical request body: **no money moves**; return the stored response with header `Idempotency-Replayed: true`.
4. Same key but DIFFERENT body: `409` with error code `IDEMPOTENCY_KEY_REUSE`.
5. No key: current behavior unchanged.
6. Store is in-memory (Map), consistent with the rest of the service.

## Acceptance criteria (tests required)
- Replay does not change any balance; response body equals the original.
- Key reuse with different body → 409 `IDEMPOTENCY_KEY_REUSE`, no money moved.
- The "KNOWN GAP" test is UPDATED to assert the new behavior when a key is provided (this is the one permitted test change, and the human reviewer checks it).
- Audit trail gains `payment.replay_detected` entries for replays.

## Out of scope
TTL/eviction, persistence, distributed locks.

## Files
`src/routes/payments.ts`, new `src/domain/idempotency.ts`, `tests/payments.test.ts`.
