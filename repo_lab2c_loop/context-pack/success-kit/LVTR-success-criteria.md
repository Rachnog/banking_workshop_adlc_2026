# LVTR acceptance criteria

*The loop only works when the end state is fully specified. These criteria ARE the done-condition: turn them into tests, commit the tests, then let the agent iterate until green. The agent may not edit the tests.*

## Acceptance criteria

1. New module `src/domain/lvtr.ts` exposes `generateLvtr(businessDate: string)` (`YYYY-MM-DD`) returning `{ filename, content }`.
2. New route `GET /reports/lvtr/:date` returns the file as `text/csv` with `Content-Disposition: attachment; filename="<filename>"`; invalid date → 400 with the standard error envelope.
3. A payment is reportable iff: it was **posted** (CLEAR or FLAGGED — REJECTED payments never post), its **VND equivalent ≥ 400,000,000** (inclusive), and its **ICT business date** equals the requested date.
4. VND equivalent: computed from minor units via `data/fx-reference.json` (VND per 1 major unit), honoring currency decimals, **rounded UP** to whole VND.
5. **One row per payment** (payments create DEBIT+CREDIT transaction pairs — report the payment once, keyed by the debit leg).
6. Business date = booking timestamp shifted to UTC+7. `2026-07-21T17:30:00Z` → business date `2026-07-22`.
7. File format exactly per `context/LVTR-FILE-SPEC.md`: header / TXN rows **ordered by endToEndId ascending** / trailer with row count + VND-equivalent sum; LF; no trailing newline.
8. `amountMajor` formatted with the currency's exact decimals (`16000.00` USD, `400000000` VND).
9. Empty business day → header + `TRAILER,0,0`.
10. Every generation writes audit entry `report.lvtr_generated` (actor `system`, entityId = the report filename) with `{ businessDate, rowCount, totalVndEquivalent }`; regeneration is idempotent (same input → byte-identical output).
11. Existing tests stay green; protected files untouched (`.githooks/pre-commit` enforces).

## Worked scenario (use it in your tests)

Create test accounts (2B VND / 10M USD-minor / 20M HKD-minor balances), then post via `postTransfer` with explicit `ts`:

| endToEndId | ccy | amountMinor | ts (UTC) | VND equiv | in report? |
|---|---|---|---|---|---|
| E2E-0001 | USD | 1_600_000 | 2026-07-22T03:00:00Z | 406,400,000 | yes |
| E2E-0002 | VND | 400_000_000 | 2026-07-21T17:30:00Z | 400,000,000 | yes — boundary: ICT date is 22 Jul; threshold inclusive |
| E2E-0003 | USD | 1_500_000 | 2026-07-22T04:00:00Z | 381,000,000 | no |
| E2E-0004 (FLAGGED) | VND | 450_000_000 | 2026-07-22T05:00:00Z | 450,000,000 | yes |
| E2E-0005 | HKD | 12_307_701 | 2026-07-22T06:00:00Z | 400,000,283 (32.5/minor, ceil) | yes |
| E2E-0006 | VND | 500_000_000 | 2026-07-23T03:00:00Z | — | no (business date 23 Jul) |

Expected file for `2026-07-22`, byte-exact:

```
REPORT,LVTR,DEMOVNVX,20260722,001
TXN,E2E-0001,T-USD-A,T-USD-B,USD,16000.00,406400000,20260722
TXN,E2E-0002,T-VND-A,T-VND-B,VND,400000000,400000000,20260722
TXN,E2E-0004,T-VND-A,T-VND-B,VND,450000000,450000000,20260722
TXN,E2E-0005,T-HKD-A,T-HKD-B,HKD,123077.01,400000283,20260722
TRAILER,4,1656400283
```

## Reference acceptance tests (time-saver — or generate your own from the criteria)

```ts
// tests/lvtr.acceptance.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/server.js";
import { resetLedger, upsertAccount, postTransfer } from "../src/domain/accounts.js";
import { resetAudit, auditTrail } from "../src/domain/audit.js";

const EXPECTED = [
  "REPORT,LVTR,DEMOVNVX,20260722,001",
  "TXN,E2E-0001,T-USD-A,T-USD-B,USD,16000.00,406400000,20260722",
  "TXN,E2E-0002,T-VND-A,T-VND-B,VND,400000000,400000000,20260722",
  "TXN,E2E-0004,T-VND-A,T-VND-B,VND,450000000,450000000,20260722",
  "TXN,E2E-0005,T-HKD-A,T-HKD-B,HKD,123077.01,400000283,20260722",
  "TRAILER,4,1656400283"
].join("\n");

function seedScenario(): void {
  for (const [id, currency, balanceMinor] of [
    ["T-VND-A", "VND", 2_000_000_000], ["T-VND-B", "VND", 0],
    ["T-USD-A", "USD", 10_000_000], ["T-USD-B", "USD", 0],
    ["T-HKD-A", "HKD", 20_000_000], ["T-HKD-B", "HKD", 0]
  ] as const) {
    upsertAccount({ id, name: `Test ${id}`, currency, balanceMinor });
  }
  const post = (endToEndId: string, debtor: string, creditor: string, currency: string, amountMinor: number, ts: string, status: "CLEAR" | "FLAGGED" = "CLEAR") =>
    postTransfer({ debtorAccountId: debtor, creditorAccountId: creditor, amountMinor, currency, endToEndId, screeningStatus: status, reasonCodes: [], ts });
  post("E2E-0001", "T-USD-A", "T-USD-B", "USD", 1_600_000, "2026-07-22T03:00:00Z");
  post("E2E-0002", "T-VND-A", "T-VND-B", "VND", 400_000_000, "2026-07-21T17:30:00Z");
  post("E2E-0003", "T-USD-A", "T-USD-B", "USD", 1_500_000, "2026-07-22T04:00:00Z");
  post("E2E-0004", "T-VND-A", "T-VND-B", "VND", 450_000_000, "2026-07-22T05:00:00Z", "FLAGGED");
  post("E2E-0005", "T-HKD-A", "T-HKD-B", "HKD", 12_307_701, "2026-07-22T06:00:00Z");
  post("E2E-0006", "T-VND-A", "T-VND-B", "VND", 500_000_000, "2026-07-23T03:00:00Z");
}

describe("LVTR acceptance", () => {
  beforeEach(() => { resetLedger(); resetAudit(); seedScenario(); });

  it("produces the byte-exact report for 2026-07-22", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain('filename="LVTR_DEMOVNVX_20260722_001.csv"');
    expect(res.body).toBe(EXPECTED);
  });

  it("is idempotent and audited", async () => {
    const app = buildApp();
    const a = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    const b = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    expect(a.body).toBe(b.body);
    const entries = auditTrail().filter((e) => e.action === "report.lvtr_generated");
    expect(entries.length).toBe(2);
    expect(entries[0]!.details).toMatchObject({ businessDate: "2026-07-22", rowCount: 4, totalVndEquivalent: 1_656_400_283 });
  });

  it("returns an empty report for a quiet day", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-25" });
    expect(res.body).toBe("REPORT,LVTR,DEMOVNVX,20260725,001\nTRAILER,0,0");
  });

  it("rejects invalid dates with the error envelope", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/22-07-2026" });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION_ERROR");
  });
});
```
